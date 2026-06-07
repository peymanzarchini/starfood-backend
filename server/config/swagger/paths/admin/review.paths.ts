export const reviewAdminPaths = {
  "/admin/reviews/stats": {
    get: {
      tags: ["Admin - Reviews"],
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
                        type: "object",
                        properties: {
                          total: { type: "integer" },
                          pending: { type: "integer" },
                          approved: { type: "integer" },
                          averageRating: { type: "number" },
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
  "/admin/reviews": {
    get: {
      tags: ["Admin - Reviews"],
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "page", in: "query", schema: { type: "integer" } },
        { name: "limit", in: "query", schema: { type: "integer" } },
        { name: "isApproved", in: "query", schema: { type: "boolean" } },
        { name: "productId", in: "query", schema: { type: "integer" } },
        { name: "rating", in: "query", schema: { type: "integer", minimum: 1, maximum: 5 } },
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
                            items: { $ref: "#/components/schemas/Review" },
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
  "/admin/reviews/{id}": {
    get: {
      tags: ["Admin - Reviews"],
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
                    properties: { body: { $ref: "#/components/schemas/Review" } },
                  },
                ],
              },
            },
          },
        },
      },
    },
    delete: {
      tags: ["Admin - Reviews"],
      security: [{ bearerAuth: [] }],
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
      responses: { 200: { $ref: "#/components/schemas/ApiResponse" } },
    },
  },
  "/admin/reviews/{id}/approval": {
    patch: {
      tags: ["Admin - Reviews"],
      security: [{ bearerAuth: [] }],
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["isApproved"],
              properties: { isApproved: { type: "boolean" } },
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
                    properties: { body: { $ref: "#/components/schemas/Review" } },
                  },
                ],
              },
            },
          },
        },
      },
    },
  },
  "/admin/reviews/bulk-approve": {
    post: {
      tags: ["Admin - Reviews"],
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["reviewIds"],
              properties: { reviewIds: { type: "array", items: { type: "integer" } } },
            },
          },
        },
      },
      responses: { 200: { description: "Approved" } },
    },
  },
  "/admin/reviews/bulk-delete": {
    post: {
      tags: ["Admin - Reviews"],
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["reviewIds"],
              properties: { reviewIds: { type: "array", items: { type: "integer" } } },
            },
          },
        },
      },
      responses: { 200: { description: "Deleted" } },
    },
  },
};
