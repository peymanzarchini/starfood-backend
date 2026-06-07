export const cartSchema = {
  CartItem: {
    type: "object",
    properties: {
      id: { type: "integer" },
      quantity: { type: "integer" },
      product: { $ref: "#/components/schemas/Product" },
      itemTotal: { type: "number" },
    },
  },
  Cart: {
    type: "object",
    properties: {
      id: { type: "integer", nullable: true },
      items: { type: "array", items: { $ref: "#/components/schemas/CartItem" } },
      itemCount: { type: "integer" },
      subtotal: { type: "number" },
      totalDiscount: { type: "number" },
      total: { type: "number" },
    },
  },
  AddToCartInput: {
    type: "object",
    required: ["productId"],
    properties: {
      productId: { type: "integer" },
      quantity: { type: "integer", minimum: 1, maximum: 99 },
    },
  },
  UpdateCartItemInput: {
    type: "object",
    required: ["quantity"],
    properties: {
      quantity: { type: "integer", minimum: 1, maximum: 99 },
    },
  },

  CartPreviewDiscountResponse: {
    type: "object",
    properties: {
      isValid: {
        type: "boolean",
        description: "Whether the discount code is valid for this cart",
        example: true,
      },
      cart: {
        $ref: "#/components/schemas/Cart",
      },
      discount: {
        type: "object",
        properties: {
          code: { type: "string", example: "WELCOME20" },
          type: { type: "string", enum: ["percentage", "fixed"], example: "percentage" },
          value: { type: "number", example: 20 },
        },
      },
      subtotal: {
        type: "number",
        description: "Cart total before discount (USD)",
        example: 17,
      },
      discountAmount: {
        type: "number",
        description: "Discount amount in USD",
        example: 3.4,
      },
      deliveryCost: {
        type: "number",
        description: "Delivery cost (0 if free delivery threshold reached)",
        example: 0,
      },
      totalAfterDiscount: {
        type: "number",
        description: "Final amount to pay (USD)",
        example: 13.6,
      },
      message: {
        type: "string",
        description: "Human-readable summary",
        example: "20% discount - $3.4 off + Free delivery!",
      },
    },
  },
};
