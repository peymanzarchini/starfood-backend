export const addressPaths = {
  "/addresses": {
    get: {
      tags: ["Address"],
      summary: "Get user addresses",
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
                      body: { type: "array", items: { $ref: "#/components/schemas/Address" } },
                    },
                  },
                ],
              },
            },
          },
        },
      },
    },
    post: {
      tags: ["Address"],
      summary: "Create address",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": { schema: { $ref: "#/components/schemas/CreateAddressInput" } },
        },
      },
      responses: {
        201: {
          content: {
            "application/json": {
              schema: {
                allOf: [
                  { $ref: "#/components/schemas/ApiResponse" },
                  {
                    type: "object",
                    properties: { body: { $ref: "#/components/schemas/Address" } },
                  },
                ],
              },
            },
          },
        },
      },
    },
  },
  "/addresses/default": {
    get: {
      tags: ["Address"],
      summary: "Get default address",
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
                    properties: { body: { $ref: "#/components/schemas/Address" } },
                  },
                ],
              },
            },
          },
        },
      },
    },
  },
  "/addresses/{id}": {
    get: {
      tags: ["Address"],
      summary: "Get address by ID",
      security: [{ bearerAuth: [] }],
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
      responses: {
        200: {
          content: {
            "application/json": {
              schema: {
                allOf: [
                  { $ref: "#/components/schemas/ApiResponse" },
                  {
                    type: "object",
                    properties: { body: { $ref: "#/components/schemas/Address" } },
                  },
                ],
              },
            },
          },
        },
      },
    },
    put: {
      tags: ["Address"],
      summary: "Update address",
      security: [{ bearerAuth: [] }],
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
      requestBody: {
        required: true,
        content: {
          "application/json": { schema: { $ref: "#/components/schemas/UpdateAddressInput" } },
        },
      },
      responses: {
        200: {
          content: {
            "application/json": {
              schema: {
                allOf: [
                  { $ref: "#/components/schemas/ApiResponse" },
                  {
                    type: "object",
                    properties: { body: { $ref: "#/components/schemas/Address" } },
                  },
                ],
              },
            },
          },
        },
      },
    },
    delete: {
      tags: ["Address"],
      summary: "Delete address",
      security: [{ bearerAuth: [] }],
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
      responses: { 200: { $ref: "#/components/schemas/ApiResponse" } },
    },
  },
  "/addresses/{id}/default": {
    patch: {
      tags: ["Address"],
      summary: "Set as default",
      security: [{ bearerAuth: [] }],
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
      responses: {
        200: {
          content: {
            "application/json": {
              schema: {
                allOf: [
                  { $ref: "#/components/schemas/ApiResponse" },
                  {
                    type: "object",
                    properties: { body: { $ref: "#/components/schemas/Address" } },
                  },
                ],
              },
            },
          },
        },
      },
    },
  },
};
