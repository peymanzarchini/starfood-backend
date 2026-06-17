export const userAdminPaths = {
  "/admin/users": {
    get: {
      tags: ["Admin - Users"],
      summary: "Get all users (Admin only)",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "page", in: "query", schema: { type: "integer", default: 1 } },
        { name: "limit", in: "query", schema: { type: "integer", default: 10 } },
        {
          name: "search",
          in: "query",
          schema: { type: "string" },
          description: "Search by name, email, or phone",
        },
        { name: "role", in: "query", schema: { type: "string", enum: ["admin", "customer"] } },
        { name: "status", in: "query", schema: { type: "string", enum: ["active", "banned"] } },
      ],
      responses: {
        200: {
          description: "List of users with pagination",
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
                        items: { $ref: "#/components/schemas/User" },
                      },
                      pagination: { $ref: "#/components/schemas/PaginationMeta" },
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
  "/admin/users/{id}": {
    get: {
      tags: ["Admin - Users"],
      summary: "Get user by ID",
      security: [{ bearerAuth: [] }],
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
      responses: {
        200: {
          content: {
            "application/json": {
              schema: {
                allOf: [
                  { $ref: "#/components/schemas/ApiResponse" },
                  { type: "object", properties: { body: { $ref: "#/components/schemas/User" } } },
                ],
              },
            },
          },
        },
      },
    },
  },
  "/admin/users/{id}/role": {
    patch: {
      tags: ["Admin - Users"],
      summary: "Update user role (Admin/Customer)",
      security: [{ bearerAuth: [] }],
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["role"],
              properties: { role: { type: "string", enum: ["admin", "customer"] } },
            },
          },
        },
      },
      responses: {
        200: {
          content: {
            "application/json": {
              schema: {
                allOf: [
                  { $ref: "#/components/schemas/ApiResponse" },
                  { type: "object", properties: { body: { $ref: "#/components/schemas/User" } } },
                ],
              },
            },
          },
        },
      },
    },
  },
  "/admin/users/{id}/toggle-status": {
    patch: {
      tags: ["Admin - Users"],
      summary: "Ban or Unban a user",
      security: [{ bearerAuth: [] }],
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
      responses: {
        200: {
          content: {
            "application/json": {
              schema: {
                allOf: [
                  { $ref: "#/components/schemas/ApiResponse" },
                  { type: "object", properties: { body: { $ref: "#/components/schemas/User" } } },
                ],
              },
            },
          },
        },
      },
    },
  },
};
