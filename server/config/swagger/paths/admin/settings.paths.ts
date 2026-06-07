export const settingsAdminPaths = {
  "/admin/settings": {
    get: {
      tags: ["Admin - Settings"],
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
                      body: { type: "object", additionalProperties: { type: "string" } },
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
  "/admin/settings/{key}": {
    patch: {
      tags: ["Admin - Settings"],
      security: [{ bearerAuth: [] }],
      parameters: [{ name: "key", in: "path", required: true, schema: { type: "string" } }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["value"],
              properties: { value: { type: "string" } },
            },
          },
        },
      },
      responses: { 200: { description: "Setting updated" } },
    },
  },
};
