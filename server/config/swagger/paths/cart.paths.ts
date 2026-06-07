export const cartPaths = {
  "/cart": {
    get: {
      tags: ["Cart"],
      summary: "Get user cart",
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          content: {
            "application/json": {
              schema: {
                allOf: [
                  { $ref: "#/components/schemas/ApiResponse" },
                  {
                    type: "object",
                    properties: { body: { $ref: "#/components/schemas/Cart" } },
                  },
                ],
              },
            },
          },
        },
      },
    },
    delete: {
      tags: ["Cart"],
      summary: "Clear cart",
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          content: {
            "application/json": {
              schema: {
                allOf: [
                  { $ref: "#/components/schemas/ApiResponse" },
                  {
                    type: "object",
                    properties: { body: { $ref: "#/components/schemas/Cart" } },
                  },
                ],
              },
            },
          },
        },
      },
    },
  },
  "/cart/count": {
    get: {
      tags: ["Cart"],
      summary: "Get cart item count",
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          content: {
            "application/json": {
              schema: {
                allOf: [
                  { $ref: "#/components/schemas/ApiResponse" },
                  {
                    type: "object",
                    properties: {
                      body: { type: "object", properties: { count: { type: "integer" } } },
                    },
                  },
                ],
              },
            },
          },
        },
      },
    },
  },
  "/cart/validate": {
    get: {
      tags: ["Cart"],
      summary: "Validate cart items",
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: "Returns cart with validation status",
          content: {
            "application/json": {
              schema: {
                allOf: [
                  { $ref: "#/components/schemas/ApiResponse" },
                  {
                    type: "object",
                    properties: {
                      body: {
                        type: "object",
                        properties: {
                          isValid: { type: "boolean" },
                          unavailableItems: { type: "array", items: { type: "string" } },
                          cart: { $ref: "#/components/schemas/Cart" },
                        },
                      },
                    },
                  },
                ],
              },
            },
          },
        },
      },
    },
  },
  "/cart/items": {
    post: {
      tags: ["Cart"],
      summary: "Add item to cart",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": { schema: { $ref: "#/components/schemas/AddToCartInput" } },
        },
      },
      responses: {
        201: {
          content: {
            "application/json": {
              schema: {
                allOf: [
                  { $ref: "#/components/schemas/ApiResponse" },
                  {
                    type: "object",
                    properties: { body: { $ref: "#/components/schemas/Cart" } },
                  },
                ],
              },
            },
          },
        },
      },
    },
  },
  "/cart/items/{itemId}": {
    patch: {
      tags: ["Cart"],
      summary: "Update cart item quantity",
      security: [{ bearerAuth: [] }],
      parameters: [{ name: "itemId", in: "path", required: true, schema: { type: "integer" } }],
      requestBody: {
        required: true,
        content: {
          "application/json": { schema: { $ref: "#/components/schemas/UpdateCartItemInput" } },
        },
      },
      responses: {
        200: {
          content: {
            "application/json": {
              schema: {
                allOf: [
                  { $ref: "#/components/schemas/ApiResponse" },
                  {
                    type: "object",
                    properties: { body: { $ref: "#/components/schemas/Cart" } },
                  },
                ],
              },
            },
          },
        },
      },
    },
    delete: {
      tags: ["Cart"],
      summary: "Remove item from cart",
      security: [{ bearerAuth: [] }],
      parameters: [{ name: "itemId", in: "path", required: true, schema: { type: "integer" } }],
      responses: {
        200: {
          content: {
            "application/json": {
              schema: {
                allOf: [
                  { $ref: "#/components/schemas/ApiResponse" },
                  {
                    type: "object",
                    properties: { body: { $ref: "#/components/schemas/Cart" } },
                  },
                ],
              },
            },
          },
        },
      },
    },
  },
  "/cart/unavailable": {
    delete: {
      tags: ["Cart"],
      summary: "Remove unavailable items",
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          content: {
            "application/json": {
              schema: {
                allOf: [
                  { $ref: "#/components/schemas/ApiResponse" },
                  {
                    type: "object",
                    properties: { body: { $ref: "#/components/schemas/Cart" } },
                  },
                ],
              },
            },
          },
        },
      },
    },
  },
  "/cart/preview-discount": {
    get: {
      tags: ["Cart"],
      summary: "Preview discount on cart",
      description:
        "Check how much discount would be applied to the current cart with a given discount code",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "code",
          in: "query",
          required: true,
          schema: { type: "string" },
          description: "Discount code to preview",
          example: "WELCOME20",
        },
      ],
      responses: {
        200: {
          description: "Discount preview result",
          content: {
            "application/json": {
              schema: {
                allOf: [
                  { $ref: "#/components/schemas/ApiResponse" },
                  {
                    type: "object",
                    properties: {
                      body: { $ref: "#/components/schemas/CartPreviewDiscountResponse" },
                    },
                  },
                ],
              },
              example: {
                success: true,
                message: "Discount preview",
                body: {
                  isValid: true,
                  cart: {
                    id: 1,
                    items: [
                      {
                        id: 1,
                        quantity: 2,
                        product: {
                          id: 1,
                          name: "Classic Burger",
                          price: 8.5,
                          finalPrice: 8.5,
                          discount: 0,
                          imageUrl: "https://example.com/burger.jpg",
                          isAvailable: true,
                        },
                        itemTotal: 17,
                      },
                    ],
                    itemCount: 2,
                    subtotal: 17,
                    totalDiscount: 0,
                    total: 17,
                  },
                  discount: {
                    code: "WELCOME20",
                    type: "percentage",
                    value: 20,
                  },
                  subtotal: 17,
                  discountAmount: 3.4,
                  deliveryCost: 0,
                  totalAfterDiscount: 13.6,
                  message: "20% discount - $3.4 off + Free delivery!",
                },
                status: 200,
              },
            },
          },
        },
        400: {
          description: "Invalid discount code or empty cart",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ApiResponse" },
            },
          },
        },
      },
    },
  },
};
