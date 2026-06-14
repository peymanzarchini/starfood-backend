import { Op } from "@sequelize/core";
import {
  Order,
  OrderItem,
  Cart,
  CartItem,
  Product,
  Address,
  Discount,
  User,
  Settings,
} from "../models/index.js";
import { sequelize } from "../config/database.js";
import { HttpError } from "../utils/httpError.js";
import { getOffset, PaginationOptions } from "../utils/pagination.js";
import {
  formatOrderListResponse,
  formatOrderDetailResponse,
  formatOrderAdminResponse,
} from "../utils/format-response/formatOrderResponse.js";
import { OrderDetailResponse, OrderAdminResponse, OrderListResponse } from "../types/index.js";
import { CreateOrderInput, UpdateOrderStatusInput } from "../validators/schemas/order.schema.js";
import { OrderStatus } from "../models/orders.model.js";

const VALID_STATUS_TRANSITIONS: Record<string, OrderStatus[]> = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["preparing", "cancelled"],
  preparing: ["ready", "cancelled"],
  ready: ["delivering"],
  delivering: ["delivered"],
  delivered: [],
  cancelled: [],
};

interface OrderItemCreationData {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

class OrderService {
  private generateOrderNumber(): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const random = String(Math.floor(Math.random() * 10000)).padStart(4, "0");
    return `ORD-${year}${month}${day}-${random}`;
  }

  async getOrderStatuses() {
    const statusInfo: Record<string, { label: string; color: string }> = {
      pending: { label: "Pending", color: "#FFA500" },
      confirmed: { label: "Confirmed", color: "#1E90FF" },
      preparing: { label: "Preparing", color: "#FFD700" },
      ready: { label: "Ready", color: "#32CD32" },
      delivering: { label: "Out for Delivery", color: "#8A2BE2" },
      delivered: { label: "Delivered", color: "#008000" },
      cancelled: { label: "Cancelled", color: "#FF0000" },
    };

    return Object.entries(VALID_STATUS_TRANSITIONS).map(([key, nextStatuses]) => ({
      key,
      label: statusInfo[key]?.label || key,
      color: statusInfo[key]?.color || "#000000",
      nextStatuses: nextStatuses.map((nextKey) => ({
        key: nextKey,
        label: statusInfo[nextKey]?.label || nextKey,
      })),
    }));
  }

  async getUserOrders(
    userId: number,
    pagination: PaginationOptions,
    status?: OrderStatus,
  ): Promise<{ items: OrderListResponse[]; totalItems: number }> {
    const { page, limit } = pagination;
    const offset = getOffset(page, limit);
    const where: Record<string, unknown> = { userId };
    if (status) where.status = status;

    const { count, rows } = await Order.findAndCountAll({
      where,
      include: [{ model: OrderItem, as: "items", attributes: ["quantity"] }],
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });

    return { items: rows.map(formatOrderListResponse), totalItems: count };
  }

  async getOrderById(orderId: number, userId: number): Promise<OrderDetailResponse> {
    const order = await Order.findOne({
      where: { id: orderId, userId },
      include: [
        { model: OrderItem, as: "items" },
        { model: Address, as: "address" },
        { model: Discount, as: "discount", attributes: ["code"] },
      ],
    });
    if (!order) throw HttpError.notFound("Order not found");
    return formatOrderDetailResponse(order);
  }

  async createOrder(userId: number, data: CreateOrderInput): Promise<OrderDetailResponse> {
    const orderId = await sequelize.transaction(async (transaction) => {
      const address = await Address.findOne({ where: { id: data.addressId, userId }, transaction });
      if (!address) throw HttpError.badRequest("Address not found");

      const cart = await Cart.findOne({
        where: { userId },
        include: [{ model: CartItem, as: "items", include: [{ model: Product, as: "product" }] }],
        transaction,
      });
      if (!cart || !cart.items || cart.items.length === 0)
        throw HttpError.badRequest("Cart is empty");

      const unavailableProducts: string[] = [];
      for (const item of cart.items) {
        if (!item.product?.isAvailable) unavailableProducts.push(item.product?.name || "Unknown");
      }
      if (unavailableProducts.length > 0)
        throw HttpError.badRequest(`Unavailable: ${unavailableProducts.join(", ")}`);

      let subtotal = 0;
      const orderItems: OrderItemCreationData[] = [];

      for (const item of cart.items) {
        const product = item.product!;
        const unitPrice =
          product.discount > 0
            ? Math.round(product.price * (1 - product.discount / 100))
            : product.price;
        const totalPrice = unitPrice * item.quantity;
        subtotal += totalPrice;

        orderItems.push({
          productId: product.id,
          productName: product.name,
          quantity: item.quantity,
          unitPrice,
          totalPrice,
        });
      }

      let discountAmount = 0;
      let discountId: number | null = null;
      if (data.discountCode) {
        const discount = await Discount.findOne({
          where: {
            code: data.discountCode.toUpperCase(),
            isActive: true,
            startDate: { [Op.lte]: new Date() },
            expireDate: { [Op.gt]: new Date() },
          },
          transaction,
        });
        if (!discount) throw HttpError.badRequest("Invalid or expired discount code");
        if (discount.usedCount >= discount.usageLimit)
          throw HttpError.badRequest("Discount code usage limit reached");
        if (subtotal < discount.minOrderAmount)
          throw HttpError.badRequest(
            `Minimum order for this discount is ${discount.minOrderAmount}`,
          );

        discountAmount = discount.calculateDiscount(subtotal);
        discountId = discount.id;
        await Discount.update(
          { usedCount: discount.usedCount + 1 },
          { where: { id: discount.id }, transaction },
        );
      }

      const deliverySetting = await Settings.findOne({
        where: { key: "DELIVERY_FEE" },
        transaction,
      });
      const deliveryCost = deliverySetting ? parseFloat(deliverySetting.value) : 5;
      const totalAmount = subtotal - discountAmount + deliveryCost;

      const order = await Order.create(
        {
          userId,
          addressId: data.addressId,
          discountId,
          subtotal,
          discountAmount,
          deliveryCost,
          totalAmount,
          notes: data.notes,
          status: "pending",
          orderNumber: this.generateOrderNumber(),
        },
        { transaction },
      );

      await OrderItem.bulkCreate(
        orderItems.map((item) => ({ ...item, orderId: order.id })),
        { transaction },
      );
      await CartItem.destroy({ where: { cartId: cart.id }, transaction });

      return order.id;
    });
    return this.getOrderById(orderId, userId);
  }

  async cancelOrder(orderId: number, userId: number): Promise<OrderDetailResponse> {
    const order = await Order.findOne({ where: { id: orderId, userId } });
    if (!order) throw HttpError.notFound("Order not found");
    if (order.status !== "pending")
      throw HttpError.badRequest("Only pending orders can be cancelled");
    await Order.update({ status: "cancelled" }, { where: { id: orderId } });
    return this.getOrderById(orderId, userId);
  }

  async getAllOrdersAdmin(
    pagination: PaginationOptions,
    filters?: { status?: OrderStatus; startDate?: string; endDate?: string; search?: string },
  ): Promise<{ items: OrderListResponse[]; totalItems: number }> {
    const { page, limit } = pagination;
    const offset = getOffset(page, limit);
    const where: Record<string | symbol, unknown> = {};

    if (filters?.status) where.status = filters.status;
    if (filters?.search) where.orderNumber = { [Op.like]: `%${filters.search}%` };

    const dateFilter: Record<string | symbol, unknown> = {};
    if (filters?.startDate) dateFilter[Op.gte] = new Date(filters.startDate);
    if (filters?.endDate) dateFilter[Op.lte] = new Date(filters.endDate);
    if (Object.keys(dateFilter).length > 0) where.createdAt = dateFilter;

    const { count, rows } = await Order.findAndCountAll({
      where,
      include: [
        { model: OrderItem, as: "items", attributes: ["quantity"] },
        { model: User, as: "user", attributes: ["id", "firstName", "lastName", "email"] },
      ],
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });
    return { items: rows.map(formatOrderListResponse), totalItems: count };
  }

  async getOrderByIdAdmin(orderId: number): Promise<OrderAdminResponse> {
    const order = await Order.findByPk(orderId, {
      include: [
        { model: OrderItem, as: "items" },
        { model: Address, as: "address" },
        { model: Discount, as: "discount", attributes: ["code"] },
        {
          model: User,
          as: "user",
          attributes: ["id", "firstName", "lastName", "email", "phoneNumber"],
        },
      ],
    });
    if (!order) throw HttpError.notFound("Order not found");
    return formatOrderAdminResponse(order);
  }

  async updateOrderStatus(
    orderId: number,
    data: UpdateOrderStatusInput,
  ): Promise<OrderAdminResponse> {
    const order = await Order.findByPk(orderId);
    if (!order) throw HttpError.notFound("Order not found");

    const currentStatus = order.status as OrderStatus;
    const allowedStatuses = VALID_STATUS_TRANSITIONS[currentStatus] || [];

    if (!allowedStatuses.includes(data.status)) {
      throw HttpError.badRequest(`Cannot change status from '${order.status}' to '${data.status}'`);
    }
    await Order.update(
      { status: data.status, estimatedDelivery: data.estimatedDelivery },
      { where: { id: orderId } },
    );
    return this.getOrderByIdAdmin(orderId);
  }

  async getOrderStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const [total, pending, confirmed, preparing, delivering, delivered, cancelled, todayOrders] =
      await Promise.all([
        Order.count(),
        Order.count({ where: { status: "pending" } }),
        Order.count({ where: { status: "confirmed" } }),
        Order.count({ where: { status: "preparing" } }),
        Order.count({ where: { status: "delivering" } }),
        Order.count({ where: { status: "delivered" } }),
        Order.count({ where: { status: "cancelled" } }),
        Order.count({ where: { createdAt: { [Op.gte]: today } } }),
      ]);
    const todayRevenueResult = await Order.sum("totalAmount", {
      where: { createdAt: { [Op.gte]: today }, status: { [Op.notIn]: ["cancelled"] } },
    });
    return {
      total,
      pending,
      confirmed,
      preparing,
      delivering,
      delivered,
      cancelled,
      todayOrders,
      todayRevenue: todayRevenueResult || 0,
    };
  }
}

export const orderService = new OrderService();
