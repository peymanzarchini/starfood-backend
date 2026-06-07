export const authPaths = {
  "/auth/register": {
    post: {
      tags: ["Authentication"],
      summary: "Register a new user",
      requestBody: {
        required: true,
        content: {
          "application/json": { schema: { $ref: "#/components/schemas/RegisterInput" } },
        },
      },
      responses: {
        201: {
          description: "User registered successfully",
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
  "/auth/login": {
    post: {
      tags: ["Authentication"],
      summary: "Login user",
      requestBody: {
        required: true,
        content: {
          "application/json": { schema: { $ref: "#/components/schemas/LoginInput" } },
        },
      },
      responses: {
        200: {
          description: "Login successful",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean" },
                  message: { type: "string" },
                  body: {
                    type: "object",
                    properties: {
                      user: { $ref: "#/components/schemas/User" },
                      accessToken: { type: "string" },
                      refreshToken: { type: "string" },
                    },
                  },
                  status: { type: "integer" },
                },
              },
            },
          },
        },
      },
    },
  },
  "/auth/refresh": {
    post: {
      tags: ["Authentication"],
      summary: "Refresh access token",
      description:
        "Refresh token should be sent via HttpOnly Cookie (refresh_token). For testing purposes in Swagger, ensure cookies are handled.",
      responses: {
        200: {
          description: "Token refreshed",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean" },
                  body: {
                    type: "object",
                    properties: { accessToken: { type: "string" } },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  "/auth/logout": {
    post: {
      tags: ["Authentication"],
      summary: "Logout user",
      security: [{ bearerAuth: [] }],
      responses: { 200: { $ref: "#/components/schemas/ApiResponse" } },
    },
  },
  "/auth/profile": {
    get: {
      tags: ["Authentication"],
      summary: "Get current user profile",
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: "Profile retrieved",
          content: {
            "application/json": {
              schema: {
                allOf: [
                  { $ref: "#/components/schemas/ApiResponse" },
                  {
                    type: "object",
                    properties: { body: { $ref: "#/components/schemas/User" } },
                  },
                ],
              },
            },
          },
        },
      },
    },
    patch: {
      tags: ["Authentication"],
      summary: "Update profile",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": { schema: { $ref: "#/components/schemas/UpdateProfileInput" } },
        },
      },
      responses: {
        200: {
          description: "Profile updated",
          content: {
            "application/json": {
              schema: {
                allOf: [
                  { $ref: "#/components/schemas/ApiResponse" },
                  {
                    type: "object",
                    properties: { body: { $ref: "#/components/schemas/User" } },
                  },
                ],
              },
            },
          },
        },
      },
    },
  },
  "/auth/change-password": {
    post: {
      tags: ["Authentication"],
      summary: "Change password",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": { schema: { $ref: "#/components/schemas/ChangePasswordInput" } },
        },
      },
      responses: { 200: { $ref: "#/components/schemas/ApiResponse" } },
    },
  },
};
