export const ordersPaths = {
  "/orders": {
    get: {
      tags: ["Orders"],
      summary: "Get user orders",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "page", in: "query", schema: { type: "integer", default: 1 } },
        { name: "limit", in: "query", schema: { type: "integer", default: 10 } },
        {
          name: "status",
          in: "query",
          schema: {
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
        },
      ],
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
                      body: {
                        type: "object",
                        properties: {
                          items: { type: "array", items: { $ref: "#/components/schemas/Order" } },
                          pagination: { $ref: "#/components/schemas/PaginationMeta" },
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
    post: {
      tags: ["Orders"],
      summary: "Create order",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": { schema: { $ref: "#/components/schemas/CreateOrderInput" } },
        },
      },
      responses: {
        201: {
          content: {
            "application/json": {
              schema: {
                allOf: [
                  { $ref: "#/components/schemas/ApiResponse" },
                  { type: "object", properties: { body: { $ref: "#/components/schemas/Order" } } },
                ],
              },
            },
          },
        },
      },
    },
  },
  "/orders/{id}": {
    get: {
      tags: ["Orders"],
      summary: "Get order details",
      security: [{ bearerAuth: [] }],
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
      responses: {
        200: {
          content: {
            "application/json": {
              schema: {
                allOf: [
                  { $ref: "#/components/schemas/ApiResponse" },
                  { type: "object", properties: { body: { $ref: "#/components/schemas/Order" } } },
                ],
              },
            },
          },
        },
      },
    },
  },
  "/orders/{id}/cancel": {
    post: {
      tags: ["Orders"],
      summary: "Cancel order",
      security: [{ bearerAuth: [] }],
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
      responses: {
        200: {
          content: {
            "application/json": {
              schema: {
                allOf: [
                  { $ref: "#/components/schemas/ApiResponse" },
                  { type: "object", properties: { body: { $ref: "#/components/schemas/Order" } } },
                ],
              },
            },
          },
        },
      },
    },
  },
};
