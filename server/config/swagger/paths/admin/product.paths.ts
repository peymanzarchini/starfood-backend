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
      summary: "Create a new product",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/CreateProductInput" },
          },
        },
      },
      responses: {
        201: {
          description: "Product created successfully",
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
      summary: "Get product by ID (with gallery)",
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
      summary: "Update product",
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
      summary: "Add one or multiple images to product gallery",
      security: [{ bearerAuth: [] }],
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["images"],
              properties: {
                images: {
                  type: "array",
                  minItems: 1,
                  maxItems: 10,
                  items: {
                    type: "object",
                    required: ["url"],
                    properties: {
                      url: { type: "string", example: "https://example.com/images/burger-1.jpg" },
                      thumbnailUrl: {
                        type: "string",
                        example: "https://example.com/images/burger-1-thumb.jpg",
                      },
                      altText: { type: "string", example: "Burger side view" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      responses: {
        201: {
          description: "Images added successfully",
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
                            id: { type: "integer" },
                            url: { type: "string" },
                            thumbnailUrl: { type: "string" },
                            altText: { type: "string" },
                            displayOrder: { type: "integer" },
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

  "/admin/products/{id}/images/reorder": {
    put: {
      tags: ["Admin - Products"],
      summary: "Reorder product gallery images",
      security: [{ bearerAuth: [] }],
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["orderedIds"],
              properties: {
                orderedIds: {
                  type: "array",
                  items: { type: "integer" },
                  description: "Array of image IDs in the desired order",
                  example: [3, 1, 2],
                },
              },
            },
          },
        },
      },
      responses: { 200: { description: "Images reordered" } },
    },
  },

  "/admin/products/{id}/cover/{imageId}": {
    patch: {
      tags: ["Admin - Products"],
      summary: "Set an image from gallery as product cover image",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "integer" },
          description: "Product ID",
        },
        {
          name: "imageId",
          in: "path",
          required: true,
          schema: { type: "integer" },
          description: "Gallery Image ID to set as cover",
        },
      ],
      responses: {
        200: {
          description: "Cover image updated",
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

  "/admin/products/{id}/cover": {
    delete: {
      tags: ["Admin - Products"],
      summary: "Remove product cover image (set to null)",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "integer" },
          description: "Product ID",
        },
      ],
      responses: { 200: { $ref: "#/components/schemas/ApiResponse" } },
    },
  },

  "/admin/products/images/{imageId}": {
    put: {
      tags: ["Admin - Products"],
      summary: "Update a product gallery image",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "imageId",
          in: "path",
          required: true,
          schema: { type: "integer" },
          description: "ID of the image to update",
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                url: { type: "string", example: "https://example.com/images/new-burger.jpg" },
                thumbnailUrl: {
                  type: "string",
                  nullable: true,
                  example: "https://example.com/images/new-burger-thumb.jpg",
                },
                altText: { type: "string", nullable: true, example: "New alt text" },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "Image updated successfully",
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
                          id: { type: "integer" },
                          url: { type: "string" },
                          thumbnailUrl: { type: "string" },
                          altText: { type: "string" },
                          displayOrder: { type: "integer" },
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
    delete: {
      tags: ["Admin - Products"],
      summary: "Delete a product gallery image",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "imageId",
          in: "path",
          required: true,
          schema: { type: "integer" },
          description: "ID of the image to delete",
        },
      ],
      responses: { 200: { $ref: "#/components/schemas/ApiResponse" } },
    },
  },
};
