export const ordersAdminPaths = {
  "/admin/orders/stats": {
    get: {
      tags: ["Admin - Orders"],
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
                    properties: { body: { $ref: "#/components/schemas/OrderStats" } },
                  },
                ],
              },
            },
          },
        },
      },
    },
  },
  "/admin/orders": {
    get: {
      tags: ["Admin - Orders"],
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "page", in: "query", schema: { type: "integer" } },
        { name: "limit", in: "query", schema: { type: "integer" } },
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
        { name: "search", in: "query", schema: { type: "string" } },
        { name: "startDate", in: "query", schema: { type: "string", format: "date-time" } },
        { name: "endDate", in: "query", schema: { type: "string", format: "date-time" } },
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
                          items: {
                            type: "array",
                            items: { $ref: "#/components/schemas/Order" },
                          },
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
  },
  "/admin/orders/{id}": {
    get: {
      tags: ["Admin - Orders"],
      security: [{ bearerAuth: [] }],
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
      responses: {
        200: {
          content: {
            "application/json": {
              schema: {
                allOf: [
                  { $ref: "#/components/schemas/ApiResponse" },
                  {
                    type: "object",
                    properties: { body: { $ref: "#/components/schemas/Order" } },
                  },
                ],
              },
            },
          },
        },
      },
    },
  },
  "/admin/orders/{id}/status": {
    patch: {
      tags: ["Admin - Orders"],
      security: [{ bearerAuth: [] }],
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["status"],
              properties: {
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
                estimatedDelivery: { type: "string", format: "date-time" },
              },
            },
          },
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
                    properties: { body: { $ref: "#/components/schemas/Order" } },
                  },
                ],
              },
            },
          },
        },
      },
    },
  },
};
