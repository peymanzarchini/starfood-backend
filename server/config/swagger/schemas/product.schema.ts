export const productSchema = {
  Product: {
    type: "object",
    properties: {
      id: { type: "integer" },
      name: { type: "string" },
      description: { type: "string" },
      price: { type: "number" },
      finalPrice: { type: "number" },
      discount: { type: "number" },
      discountAmount: { type: "number" },
      imageUrl: { type: "string", format: "uri" },
      isAvailable: { type: "boolean" },
      isPopular: { type: "boolean" },
      categoryId: { type: "integer" },
      ingredients: { type: "array", items: { type: "string" } },
      preparationTime: { type: "integer", nullable: true },
      calories: { type: "integer", nullable: true },
    },
  },
  ProductDetail: {
    allOf: [
      { $ref: "#/components/schemas/Product" },
      {
        type: "object",
        properties: {
          gallery: {
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
          category: {
            type: "object",
            properties: { id: { type: "integer" }, name: { type: "string" } },
          },
        },
      },
    ],
  },
  CreateProductInput: {
    type: "object",
    required: ["name", "description", "price", "categoryId"],
    properties: {
      name: { type: "string" },
      description: { type: "string" },
      price: { type: "number" },
      categoryId: { type: "integer" },
      imageUrl: { type: "string" },
      ingredients: { type: "array", items: { type: "string" } },
      preparationTime: { type: "integer" },
      calories: { type: "integer" },
      discount: { type: "integer", minimum: 0, maximum: 100 },
      isAvailable: { type: "boolean" },
      isPopular: { type: "boolean" },
    },
  },
  UpdateProductInput: {
    type: "object",
    properties: {
      name: { type: "string" },
      description: { type: "string" },
      price: { type: "number" },
      categoryId: { type: "integer" },
      imageUrl: { type: "string" },
      ingredients: { type: "array", items: { type: "string" } },
      preparationTime: { type: "integer" },
      calories: { type: "integer" },
      discount: { type: "integer", minimum: 0, maximum: 100 },
      isAvailable: { type: "boolean" },
      isPopular: { type: "boolean" },
    },
  },
};
