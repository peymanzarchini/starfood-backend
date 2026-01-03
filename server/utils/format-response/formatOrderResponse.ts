import { Order } from "../../models/orders.model.js";
import { OrderItem } from "../../models/orderItem.model.js";
import {
  OrderListResponse,
  OrderDetailResponse,
  OrderItemResponse,
  OrderAddressResponse,
  OrderAdminResponse,
} from "../../types/index.js";

export function formatOrderItemResponse(item: OrderItem): OrderItemResponse {
  return {
    id: item.id,
    productId: item.productId,
    productName: item.productName,
    quantity: item.quantity,
    unitPrice: item.unitPrice,
    totalPrice: item.totalPrice,
  };
}

export function formatOrderAddressResponse(order: Order): OrderAddressResponse {
  const address = order.address!;
  return {
    id: address.id,
    title: address.title,
    street: address.street,
    city: address.city,
    phoneNumber: address.phoneNumber,
    fullAddress: `${address.street}, ${address.city}`,
  };
}

export function formatOrderListResponse(order: Order): OrderListResponse {
  return {
    id: order.id,
    orderNumber: order.orderNumber,
    status: order.status,
    itemCount: order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0,
    totalAmount: order.totalAmount,
    createdAt: order.createdAt!,
  };
}

export function formatOrderDetailResponse(order: Order): OrderDetailResponse {
  return {
    id: order.id,
    orderNumber: order.orderNumber,
    status: order.status,
    subtotal: order.subtotal,
    discountAmount: order.discountAmount,
    deliveryCost: order.deliveryCost,
    totalAmount: order.totalAmount,
    notes: order.notes,
    estimatedDelivery: order.estimatedDelivery,
    items: order.items?.map(formatOrderItemResponse) || [],
    address: formatOrderAddressResponse(order),
    discountCode: order.discount?.code || null,
    createdAt: order.createdAt!,
    updatedAt: order.updatedAt!,
  };
}

export function formatOrderAdminResponse(order: Order): OrderAdminResponse {
  const user = order.user!;
  return {
    ...formatOrderDetailResponse(order),
    user: {
      id: user.id,
      fullName: `${user.firstName} ${user.lastName}`,
      email: user.email,
      phoneNumber: user.phoneNumber,
    },
  };
}
