export const ordersAdminPaths = {
  "/admin/orders/statuses": {
    get: {
      tags: ["Admin - Orders"],
      summary: "Get all possible order statuses and their valid transitions",
      description:
        "Returns a list of order statuses with Persian labels and allowed next statuses for UI dropdowns",
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
                      body: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            key: { type: "string", example: "pending" },
                            label: { type: "string", example: "در انتظار تایید" },
                            color: { type: "string", example: "#FFA500" },
                            nextStatuses: {
                              type: "array",
                              items: {
                                type: "object",
                                properties: {
                                  key: { type: "string", example: "confirmed" },
                                  label: { type: "string", example: "تایید شده" },
                                },
                              },
                            },
                          },
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
                  { type: "object", properties: { body: { $ref: "#/components/schemas/Order" } } },
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
                  description: "The key received from /admin/orders/statuses endpoint",
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
