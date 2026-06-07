export const authSchemas = {
  User: {
    type: "object",
    properties: {
      id: { type: "integer" },
      firstName: { type: "string" },
      lastName: { type: "string" },
      email: { type: "string", format: "email" },
      phoneNumber: { type: "string" },
      role: { type: "string", enum: ["admin", "customer"] },
      createdAt: { type: "string", format: "date-time" },
    },
  },
  LoginInput: {
    type: "object",
    required: ["email", "password"],
    properties: {
      email: { type: "string", format: "email" },
      password: { type: "string", format: "password" },
    },
  },
  RegisterInput: {
    type: "object",
    required: ["firstName", "lastName", "email", "password", "phoneNumber"],
    properties: {
      firstName: { type: "string", minLength: 2, maxLength: 50 },
      lastName: { type: "string", minLength: 2, maxLength: 50 },
      email: { type: "string", format: "email" },
      password: { type: "string", minLength: 8 },
      phoneNumber: { type: "string" },
    },
  },

  UpdateProfileInput: {
    type: "object",
    properties: {
      firstName: { type: "string", minLength: 2, maxLength: 50 },
      lastName: { type: "string", minLength: 2, maxLength: 50 },
      phoneNumber: { type: "string" },
    },
  },
  ChangePasswordInput: {
    type: "object",
    required: ["currentPassword", "newPassword", "confirmPassword"],
    properties: {
      currentPassword: { type: "string" },
      newPassword: { type: "string", minLength: 8 },
      confirmPassword: { type: "string" },
    },
  },
};
