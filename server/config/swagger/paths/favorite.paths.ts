export const favoritePaths = {
  "/favorites": {
    get: {
      tags: ["Favorites"],
      summary: "Get user favorites",
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
                      body: { type: "array", items: { $ref: "#/components/schemas/Favorite" } },
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
  "/favorites/toggle/{productId}": {
    post: {
      tags: ["Favorites"],
      summary: "Toggle favorite status",
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
                      body: {
                        type: "object",
                        properties: {
                          isFavorite: { type: "boolean" },
                          message: { type: "string" },
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
  "/favorites/{productId}": {
    delete: {
      tags: ["Favorites"],
      summary: "Remove from favorites",
      security: [{ bearerAuth: [] }],
      parameters: [{ name: "productId", in: "path", required: true, schema: { type: "integer" } }],
      responses: { 200: { $ref: "#/components/schemas/ApiResponse" } },
    },
  },
};
