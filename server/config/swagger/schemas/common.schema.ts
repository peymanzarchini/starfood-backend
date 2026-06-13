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
  PaginationMeta: {
    type: "object",
    properties: {
      pageNumber: { type: "integer", example: 1 },
      pageSize: { type: "integer", example: 10 },
      totalItems: { type: "integer", example: 50 },
      totalPages: { type: "integer", example: 5 },
    },
  },
};
