export const categoryPaths = {
  "/categories": {
    get: {
      tags: ["Categories"],
      summary: "Get all active categories",
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
                      body: { type: "array", items: { $ref: "#/components/schemas/Category" } },
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
  "/categories/{id}": {
    get: {
      tags: ["Categories"],
      summary: "Get category by ID",
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
                    properties: { body: { $ref: "#/components/schemas/Category" } },
                  },
                ],
              },
            },
          },
        },
      },
    },
  },
  "/categories/{id}/products": {
    get: {
      tags: ["Categories", "Products"],
      summary: "Get products in a category",
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "integer" } },
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
                          category: { $ref: "#/components/schemas/Category" },
                          products: {
                            type: "array",
                            items: { $ref: "#/components/schemas/Product" },
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
};
