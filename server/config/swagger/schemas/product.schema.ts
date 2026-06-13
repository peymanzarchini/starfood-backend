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
      imageUrl: { type: "string", format: "uri", nullable: true },
      isAvailable: { type: "boolean" },
      isPopular: { type: "boolean" },
      categoryId: { type: "integer" },
      ingredients: { type: "array", items: { type: "string" } },
      preparationTime: { type: "integer", nullable: true },
      calories: { type: "integer", nullable: true },
      imageCount: { type: "integer", description: "Number of gallery images" },
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
      name: { type: "string", example: "Classic Burger" },
      description: { type: "string", example: "Fresh beef with lettuce and tomato" },
      price: { type: "number", example: 9.99 },
      categoryId: { type: "integer", example: 1 },
      imageUrl: { type: "string", nullable: true, example: "https://url.com/image.jpg" },
      ingredients: {
        type: "array",
        items: { type: "string" },
        example: ["Tomato", "Cheese"],
      },
      preparationTime: { type: "integer", example: 20, description: "Time in minutes" },
      calories: { type: "integer", example: 400 },
      discount: { type: "integer", minimum: 0, maximum: 100, example: 0 },
      isAvailable: { type: "boolean", default: true },
      isPopular: { type: "boolean", default: false },
    },
  },
  UpdateProductInput: {
    type: "object",
    properties: {
      name: { type: "string" },
      description: { type: "string" },
      price: { type: "number" },
      categoryId: { type: "integer" },
      imageUrl: { type: "string", nullable: true, description: "Send null to remove cover image" },
      ingredients: { type: "array", items: { type: "string" } },
      preparationTime: { type: "integer" },
      calories: { type: "integer" },
      discount: { type: "integer", minimum: 0, maximum: 100 },
      isAvailable: { type: "boolean" },
      isPopular: { type: "boolean" },
    },
  },
};
