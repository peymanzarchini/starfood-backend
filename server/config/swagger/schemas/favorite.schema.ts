export const favoriteSchema = {
  Favorite: {
    type: "object",
    properties: {
      id: { type: "integer" },
      productId: { type: "integer" },
      product: { $ref: "#/components/schemas/Product" },
      createdAt: { type: "string", format: "date-time" },
    },
  },
};
