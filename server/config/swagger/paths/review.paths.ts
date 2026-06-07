export const reviewPaths = {
  "/reviews/my": {
    get: {
      tags: ["Reviews"],
      summary: "Get current user reviews",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "page", in: "query", schema: { type: "integer", default: 1 } },
        { name: "limit", in: "query", schema: { type: "integer", default: 10 } },
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
  "/reviews/can-review/{productId}": {
    get: {
      tags: ["Reviews"],
      summary: "Check if user can review",
      security: [{ bearerAuth: [] }],
      parameters: [{ name: "productId", in: "path", required: true, schema: { type: "integer" } }],
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
                      body: { type: "object", properties: { canReview: { type: "boolean" } } },
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
  "/reviews": {
    post: {
      tags: ["Reviews"],
      summary: "Create review",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": { schema: { $ref: "#/components/schemas/CreateReviewInput" } },
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
  "/reviews/{id}": {
    put: {
      tags: ["Reviews"],
      summary: "Update review",
      security: [{ bearerAuth: [] }],
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
      requestBody: {
        required: true,
        content: {
          "application/json": { schema: { $ref: "#/components/schemas/UpdateReviewInput" } },
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
    delete: {
      tags: ["Reviews"],
      summary: "Delete review",
      security: [{ bearerAuth: [] }],
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
      responses: { 200: { $ref: "#/components/schemas/ApiResponse" } },
    },
  },
};
