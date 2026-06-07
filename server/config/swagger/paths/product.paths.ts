export const productPaths = {
  "/products": {
    get: {
      tags: ["Products"],
      summary: "Get products with filters",
      parameters: [
        { name: "page", in: "query", schema: { type: "integer", default: 1 } },
        { name: "limit", in: "query", schema: { type: "integer", default: 10 } },
        { name: "categoryId", in: "query", schema: { type: "integer" } },
        { name: "minPrice", in: "query", schema: { type: "number" } },
        { name: "maxPrice", in: "query", schema: { type: "number" } },
        { name: "search", in: "query", schema: { type: "string" } },
        { name: "isPopular", in: "query", schema: { type: "boolean" } },
        {
          name: "sortBy",
          in: "query",
          schema: { type: "string", enum: ["price", "createdAt", "name", "discount"] },
        },
        { name: "sortOrder", in: "query", schema: { type: "string", enum: ["asc", "desc"] } },
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
  "/products/popular": {
    get: {
      tags: ["Products"],
      summary: "Get popular products",
      parameters: [{ name: "limit", in: "query", schema: { type: "integer", default: 10 } }],
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
                      body: { type: "array", items: { $ref: "#/components/schemas/Product" } },
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
  "/products/discounted": {
    get: {
      tags: ["Products"],
      summary: "Get discounted products",
      parameters: [{ name: "limit", in: "query", schema: { type: "integer", default: 10 } }],
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
                      body: { type: "array", items: { $ref: "#/components/schemas/Product" } },
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
  "/products/{id}": {
    get: {
      tags: ["Products"],
      summary: "Get product details",
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
                    properties: { body: { $ref: "#/components/schemas/ProductDetail" } },
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
