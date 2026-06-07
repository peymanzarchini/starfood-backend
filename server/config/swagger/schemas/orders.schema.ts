export const ordersSchema = {
  OrderItem: {
    type: "object",
    properties: {
      id: { type: "integer" },
      productId: { type: "integer" },
      productName: { type: "string" },
      quantity: { type: "integer" },
      unitPrice: { type: "number" },
      totalPrice: { type: "number" },
    },
  },
  Order: {
    type: "object",
    properties: {
      id: { type: "integer" },
      orderNumber: { type: "string" },
      status: {
        type: "string",
        enum: [
          "pending",
          "confirmed",
          "preparing",
          "ready",
          "delivering",
          "delivered",
          "cancelled",
        ],
      },
      subtotal: { type: "number" },
      discountAmount: { type: "number" },
      deliveryCost: { type: "number" },
      totalAmount: { type: "number" },
      notes: { type: "string", nullable: true },
      discountCode: { type: "string", nullable: true },
      createdAt: { type: "string", format: "date-time" },
      items: { type: "array", items: { $ref: "#/components/schemas/OrderItem" } },
      address: { $ref: "#/components/schemas/Address" },
    },
  },
  CreateOrderInput: {
    type: "object",
    required: ["addressId"],
    properties: {
      addressId: { type: "integer" },
      discountCode: { type: "string" },
      notes: { type: "string" },
    },
  },
  OrderStats: {
    type: "object",
    properties: {
      total: { type: "integer" },
      pending: { type: "integer" },
      confirmed: { type: "integer" },
      preparing: { type: "integer" },
      delivering: { type: "integer" },
      delivered: { type: "integer" },
      cancelled: { type: "integer" },
      todayOrders: { type: "integer" },
      todayRevenue: { type: "number" },
    },
  },
};
