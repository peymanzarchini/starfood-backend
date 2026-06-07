export const reviewSchema = {
  Review: {
    type: "object",
    properties: {
      id: { type: "integer" },
      rating: { type: "number", minimum: 1, maximum: 5 },
      comment: { type: "string", nullable: true },
      isApproved: { type: "boolean" },
      user: {
        type: "object",
        properties: {
          id: { type: "integer" },
          firstName: { type: "string" },
          lastName: { type: "string" },
        },
      },
      createdAt: { type: "string", format: "date-time" },
    },
  },
  CreateReviewInput: {
    type: "object",
    required: ["productId", "rating"],
    properties: {
      productId: { type: "integer" },
      rating: { type: "number", minimum: 1, maximum: 5 },
      comment: { type: "string" },
    },
  },
  UpdateReviewInput: {
    type: "object",
    properties: {
      rating: { type: "number", minimum: 1, maximum: 5 },
      comment: { type: "string" },
    },
  },
};
