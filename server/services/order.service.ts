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
} from "../models/index.js";
import { sequelize } from "../config/database.js";
import { HttpError } from "../utils/httpError.js";
import { paginate, getOffset, PaginationOptions } from "../utils/pagination.js";
import {
  formatOrderListResponse,
  formatOrderDetailResponse,
  formatOrderAdminResponse,
} from "../utils/format-response/formatOrderResponse.js";
import { OrderDetailResponse, OrderAdminResponse } from "../types/index.js";
import { CreateOrderInput, UpdateOrderStatusInput } from "../validators/schemas/order.schema.js";
import { OrderStatus } from "../models/orders.model.js";

/**
 * Default delivery cost (can be moved to Settings)
 */
const DEFAULT_DELIVERY_COST = 25000;

/**
 * Valid status transitions
 */
const VALID_STATUS_TRANSITIONS: Record<string, OrderStatus[]> = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["preparing", "cancelled"],
  preparing: ["ready", "cancelled"],
  ready: ["delivering"],
  delivering: ["delivered"],
  delivered: [],
  cancelled: [],
};

/**
 * Order Service
 * Handles all order business logic
 */
class OrderService {
  /**
   * Get user's orders
   */
  async getUserOrders(userId: number, pagination: PaginationOptions, status?: OrderStatus) {
    const { page, limit } = pagination;
    const offset = getOffset(page, limit);

    const where: Record<string, unknown> = { userId };

    if (status) {
      where.status = status;
    }

    const { count, rows } = await Order.findAndCountAll({
      where,
      include: [
        {
          model: OrderItem,
          as: "items",
          attributes: ["quantity"],
        },
      ],
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });

    const orders = rows.map(formatOrderListResponse);

    return paginate(orders, count, page, limit);
  }

  /**
   * Get order by ID for user
   */
  async getOrderById(orderId: number, userId: number): Promise<OrderDetailResponse> {
    const order = await Order.findOne({
      where: { id: orderId, userId },
      include: [
        {
          model: OrderItem,
          as: "items",
        },
        {
          model: Address,
          as: "address",
        },
        {
          model: Discount,
          as: "discount",
          attributes: ["code"],
        },
      ],
    });

    if (!order) {
      throw HttpError.notFound("Order not found");
    }

    return formatOrderDetailResponse(order);
  }

  /**
   * Create order from cart
   */
  async createOrder(userId: number, data: CreateOrderInput): Promise<OrderDetailResponse> {
    // Use managed transaction with callback
    const orderId = await sequelize.transaction(async (transaction) => {
      // 1. Validate address belongs to user
      const address = await Address.findOne({
        where: { id: data.addressId, userId },
        transaction,
      });

      if (!address) {
        throw HttpError.badRequest("Address not found");
      }

      // 2. Get cart with items
      const cart = await Cart.findOne({
        where: { userId },
        include: [
          {
            model: CartItem,
            as: "items",
            include: [
              {
                model: Product,
                as: "product",
              },
            ],
          },
        ],
        transaction,
      });

      if (!cart || !cart.items || cart.items.length === 0) {
        throw HttpError.badRequest("Cart is empty");
      }

      // 3. Validate all products are available
      const unavailableProducts: string[] = [];
      for (const item of cart.items) {
        if (!item.product?.isAvailable) {
          unavailableProducts.push(item.product?.name || "Unknown product");
        }
      }

      if (unavailableProducts.length > 0) {
        throw HttpError.badRequest(
          `Some products are unavailable: ${unavailableProducts.join(", ")}`
        );
      }

      // 4. Calculate totals
      let subtotal = 0;
      const orderItems: {
        productId: number;
        productName: string;
        quantity: number;
        unitPrice: number;
        totalPrice: number;
      }[] = [];

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

      // 5. Apply discount code if provided
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

        if (!discount) {
          throw HttpError.badRequest("Invalid or expired discount code");
        }

        if (discount.usedCount >= discount.usageLimit) {
          throw HttpError.badRequest("Discount code usage limit reached");
        }

        if (subtotal < discount.minOrderAmount) {
          throw HttpError.badRequest(
            `Minimum order amount for this discount is ${discount.minOrderAmount}`
          );
        }

        // Calculate discount
        discountAmount = this.calculateDiscountAmount(discount, subtotal);
        discountId = discount.id;

        // Increment usage count
        await Discount.update(
          { usedCount: discount.usedCount + 1 },
          { where: { id: discount.id }, transaction }
        );
      }

      // 6. Calculate final total
      const deliveryCost = DEFAULT_DELIVERY_COST;
      const totalAmount = subtotal - discountAmount + deliveryCost;

      // 7. Create order
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
        },
        { transaction }
      );

      // 8. Create order items
      await OrderItem.bulkCreate(
        orderItems.map((item) => ({
          ...item,
          orderId: order.id,
        })),
        { transaction }
      );

      // 9. Clear cart
      await CartItem.destroy({
        where: { cartId: cart.id },
        transaction,
      });

      // 10. Return order ID
      return order.id;
    });

    // 11. Return created order (outside transaction)
    return this.getOrderById(orderId, userId);
  }

  /**
   * Calculate discount amount
   */
  private calculateDiscountAmount(discount: Discount, orderAmount: number): number {
    if (orderAmount < discount.minOrderAmount) {
      return 0;
    }

    let discountValue: number;

    if (discount.type === "percentage") {
      discountValue = Math.round(orderAmount * (discount.value / 100));
    } else {
      discountValue = discount.value;
    }

    // Apply max discount cap if set
    if (discount.maxDiscountAmount && discountValue > discount.maxDiscountAmount) {
      discountValue = discount.maxDiscountAmount;
    }

    return discountValue;
  }

  /**
   * Cancel order (user can only cancel pending orders)
   */
  async cancelOrder(orderId: number, userId: number): Promise<OrderDetailResponse> {
    const order = await Order.findOne({
      where: { id: orderId, userId },
    });

    if (!order) {
      throw HttpError.notFound("Order not found");
    }

    if (order.status !== "pending") {
      throw HttpError.badRequest("Only pending orders can be cancelled");
    }

    await Order.update({ status: "cancelled" }, { where: { id: orderId } });

    return this.getOrderById(orderId, userId);
  }

  // ============================================================
  // ADMIN METHODS
  // ============================================================

  /**
   * Get all orders (admin)
   */
  async getAllOrdersAdmin(
    pagination: PaginationOptions,
    filters?: {
      status?: OrderStatus;
      startDate?: string;
      endDate?: string;
      search?: string;
    }
  ) {
    const { page, limit } = pagination;
    const offset = getOffset(page, limit);

    const where: Record<string, unknown> = {};

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.startDate) {
      where.createdAt = {
        ...((where.createdAt as object) || {}),
        [Op.gte]: new Date(filters.startDate),
      };
    }

    if (filters?.endDate) {
      where.createdAt = {
        ...((where.createdAt as object) || {}),
        [Op.lte]: new Date(filters.endDate),
      };
    }

    // Search by order number
    if (filters?.search) {
      where.orderNumber = { [Op.like]: `%${filters.search}%` };
    }

    const { count, rows } = await Order.findAndCountAll({
      where,
      include: [
        {
          model: OrderItem,
          as: "items",
          attributes: ["quantity"],
        },
        {
          model: User,
          as: "user",
          attributes: ["id", "firstName", "lastName", "email"],
        },
      ],
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });

    const orders = rows.map(formatOrderListResponse);

    return paginate(orders, count, page, limit);
  }

  /**
   * Get order by ID (admin)
   */
  async getOrderByIdAdmin(orderId: number): Promise<OrderAdminResponse> {
    const order = await Order.findByPk(orderId, {
      include: [
        {
          model: OrderItem,
          as: "items",
        },
        {
          model: Address,
          as: "address",
        },
        {
          model: Discount,
          as: "discount",
          attributes: ["code"],
        },
        {
          model: User,
          as: "user",
          attributes: ["id", "firstName", "lastName", "email", "phoneNumber"],
        },
      ],
    });

    if (!order) {
      throw HttpError.notFound("Order not found");
    }

    return formatOrderAdminResponse(order);
  }

  /**
   * Update order status (admin)
   */
  async updateOrderStatus(
    orderId: number,
    data: UpdateOrderStatusInput
  ): Promise<OrderAdminResponse> {
    const order = await Order.findByPk(orderId);

    if (!order) {
      throw HttpError.notFound("Order not found");
    }

    // Validate status transition
    const currentStatus = order.status as string;
    const allowedStatuses = VALID_STATUS_TRANSITIONS[currentStatus] || [];

    if (!allowedStatuses.includes(data.status)) {
      throw HttpError.badRequest(`Cannot change status from '${order.status}' to '${data.status}'`);
    }

    await Order.update(
      {
        status: data.status,
        estimatedDelivery: data.estimatedDelivery,
      },
      { where: { id: orderId } }
    );

    return this.getOrderByIdAdmin(orderId);
  }

  /**
   * Get order statistics (admin)
   */
  async getOrderStats(): Promise<{
    total: number;
    pending: number;
    confirmed: number;
    preparing: number;
    delivering: number;
    delivered: number;
    cancelled: number;
    todayOrders: number;
    todayRevenue: number;
  }> {
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

    // Calculate today's revenue
    const todayRevenueResult = await Order.sum("totalAmount", {
      where: {
        createdAt: { [Op.gte]: today },
        status: { [Op.notIn]: ["cancelled"] },
      },
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
