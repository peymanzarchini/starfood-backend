export const categorySchema = {
  Category: {
    type: "object",
    properties: {
      id: { type: "integer" },
      name: { type: "string" },
      description: { type: "string", nullable: true },
      imageUrl: { type: "string", nullable: true },
      displayOrder: { type: "integer" },
      isActive: { type: "boolean" },
      productCount: { type: "integer" },
    },
  },
  CreateCategoryInput: {
    type: "object",
    required: ["name"],
    properties: {
      name: { type: "string" },
      description: { type: "string" },
      imageUrl: { type: "string" },
      displayOrder: { type: "integer" },
      isActive: { type: "boolean" },
    },
  },
  UpdateCategoryInput: {
    type: "object",
    properties: {
      name: { type: "string" },
      description: { type: "string" },
      imageUrl: { type: "string" },
      displayOrder: { type: "integer" },
      isActive: { type: "boolean" },
    },
  },
};
