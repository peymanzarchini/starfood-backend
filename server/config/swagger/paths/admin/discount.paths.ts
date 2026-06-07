export const discountAdminPaths = {
  "/admin/discounts": {
    get: {
      tags: ["Admin - Discounts"],
      summary: "Get all discounts",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "page", in: "query", schema: { type: "integer", default: 1 } },
        { name: "limit", in: "query", schema: { type: "integer", default: 10 } },
        { name: "isActive", in: "query", schema: { type: "boolean" } },
        { name: "search", in: "query", schema: { type: "string" } },
      ],
      responses: {
        200: {
          description: "List of discounts with pagination",
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
                            items: { $ref: "#/components/schemas/Discount" },
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
    post: {
      tags: ["Admin - Discounts"],
      summary: "Create new discount code",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/CreateDiscountInput" },
            example: {
              code: "WELCOME20",
              type: "percentage",
              value: 20,
              minOrderAmount: 100000,
              maxDiscountAmount: 50000,
              usageLimit: 100,
              expireDate: "2025-12-31T23:59:59.000Z",
              isActive: true,
            },
          },
        },
      },
      responses: {
        201: {
          description: "Discount created successfully",
          content: {
            "application/json": {
              schema: {
                allOf: [
                  { $ref: "#/components/schemas/ApiResponse" },
                  {
                    type: "object",
                    properties: { body: { $ref: "#/components/schemas/Discount" } },
                  },
                ],
              },
            },
          },
        },
      },
    },
  },

  "/admin/discounts/stats": {
    get: {
      tags: ["Admin - Discounts"],
      summary: "Get discount statistics",
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: "Discount statistics",
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
                          total: { type: "integer", example: 10 },
                          active: { type: "integer", example: 7 },
                          expired: { type: "integer", example: 2 },
                          exhausted: { type: "integer", example: 1 },
                          totalUsed: { type: "integer", example: 156 },
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

  "/admin/discounts/{id}": {
    get: {
      tags: ["Admin - Discounts"],
      summary: "Get discount by ID",
      security: [{ bearerAuth: [] }],
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
      responses: {
        200: {
          description: "Discount details",
          content: {
            "application/json": {
              schema: {
                allOf: [
                  { $ref: "#/components/schemas/ApiResponse" },
                  {
                    type: "object",
                    properties: { body: { $ref: "#/components/schemas/Discount" } },
                  },
                ],
              },
            },
          },
        },
      },
    },
    put: {
      tags: ["Admin - Discounts"],
      summary: "Update discount",
      security: [{ bearerAuth: [] }],
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/UpdateDiscountInput" },
          },
        },
      },
      responses: {
        200: {
          description: "Discount updated successfully",
          content: {
            "application/json": {
              schema: {
                allOf: [
                  { $ref: "#/components/schemas/ApiResponse" },
                  {
                    type: "object",
                    properties: { body: { $ref: "#/components/schemas/Discount" } },
                  },
                ],
              },
            },
          },
        },
      },
    },
    delete: {
      tags: ["Admin - Discounts"],
      summary: "Delete discount",
      security: [{ bearerAuth: [] }],
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
      responses: {
        200: {
          description: "Discount deleted successfully",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ApiResponse" },
            },
          },
        },
      },
    },
  },

  "/admin/discounts/{id}/toggle": {
    patch: {
      tags: ["Admin - Discounts"],
      summary: "Toggle discount active status",
      security: [{ bearerAuth: [] }],
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
      responses: {
        200: {
          description: "Discount status toggled",
          content: {
            "application/json": {
              schema: {
                allOf: [
                  { $ref: "#/components/schemas/ApiResponse" },
                  {
                    type: "object",
                    properties: { body: { $ref: "#/components/schemas/Discount" } },
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
