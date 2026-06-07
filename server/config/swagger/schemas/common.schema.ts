export const commonSchemas = {
  ApiResponse: {
    type: "object",
    properties: {
      success: { type: "boolean", example: true },
      message: { type: "string", example: "Operation successful" },
      body: { type: "object" },
      status: { type: "integer", example: 200 },
    },
  },
  Error: {
    type: "object",
    properties: {
      success: { type: "boolean", example: false },
      message: { type: "string" },
      body: { type: "object" },
      status: { type: "number", example: 400 },
    },
  },
  PaginationMeta: {
    type: "object",
    properties: {
      currentPage: { type: "integer" },
      totalPages: { type: "integer" },
      totalItems: { type: "integer" },
      itemsPerPage: { type: "integer" },
      hasNextPage: { type: "boolean" },
      hasPrevPage: { type: "boolean" },
    },
  },
};
