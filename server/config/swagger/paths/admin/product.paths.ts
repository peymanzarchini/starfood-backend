export const productAdminPaths = {
  "/admin/products": {
    get: {
      tags: ["Admin - Products"],
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "page", in: "query", schema: { type: "integer" } },
        { name: "limit", in: "query", schema: { type: "integer" } },
        { name: "search", in: "query", schema: { type: "string" } },
        { name: "categoryId", in: "query", schema: { type: "integer" } },
        { name: "isAvailable", in: "query", schema: { type: "boolean" } },
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
    post: {
      tags: ["Admin - Products"],
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": { schema: { $ref: "#/components/schemas/CreateProductInput" } },
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
  "/admin/products/{id}": {
    get: {
      tags: ["Admin - Products"],
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
                    properties: { body: { $ref: "#/components/schemas/ProductDetail" } },
                  },
                ],
              },
            },
          },
        },
      },
    },
    put: {
      tags: ["Admin - Products"],
      security: [{ bearerAuth: [] }],
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
      requestBody: {
        required: true,
        content: {
          "application/json": { schema: { $ref: "#/components/schemas/UpdateProductInput" } },
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
                    properties: { body: { $ref: "#/components/schemas/ProductDetail" } },
                  },
                ],
              },
            },
          },
        },
      },
    },
    delete: {
      tags: ["Admin - Products"],
      security: [{ bearerAuth: [] }],
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
      responses: { 200: { $ref: "#/components/schemas/ApiResponse" } },
    },
  },
  "/admin/products/{id}/toggle-availability": {
    patch: {
      tags: ["Admin - Products"],
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
  "/admin/products/{id}/toggle-popular": {
    patch: {
      tags: ["Admin - Products"],
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
  "/admin/products/{id}/images": {
    post: {
      tags: ["Admin - Products"],
      security: [{ bearerAuth: [] }],
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["url"],
              properties: {
                url: { type: "string" },
                thumbnailUrl: { type: "string" },
                altText: { type: "string" },
              },
            },
          },
        },
      },
      responses: { 201: { description: "Image added" } },
    },
  },
  "/admin/products/images/{imageId}": {
    put: {
      tags: ["Admin - Products"],
      security: [{ bearerAuth: [] }],
      parameters: [{ name: "imageId", in: "path", required: true, schema: { type: "integer" } }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                url: { type: "string" },
                thumbnailUrl: { type: "string" },
                altText: { type: "string" },
              },
            },
          },
        },
      },
      responses: { 200: { description: "Image updated" } },
    },
    delete: {
      tags: ["Admin - Products"],
      security: [{ bearerAuth: [] }],
      parameters: [{ name: "imageId", in: "path", required: true, schema: { type: "integer" } }],
      responses: { 200: { $ref: "#/components/schemas/ApiResponse" } },
    },
  },
};
