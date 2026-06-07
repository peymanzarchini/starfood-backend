export const addressSchema = {
  Address: {
    type: "object",
    properties: {
      id: { type: "integer" },
      title: { type: "string" },
      street: { type: "string" },
      city: { type: "string" },
      postalCode: { type: "string", nullable: true },
      phoneNumber: { type: "string" },
      latitude: { type: "number", nullable: true },
      longitude: { type: "number", nullable: true },
      isDefault: { type: "boolean" },
      fullAddress: { type: "string" },
    },
  },
  CreateAddressInput: {
    type: "object",
    required: ["title", "street", "city", "phoneNumber"],
    properties: {
      title: { type: "string", minLength: 2, maxLength: 50 },
      street: { type: "string", minLength: 5 },
      city: { type: "string", minLength: 2 },
      postalCode: { type: "string" },
      phoneNumber: { type: "string" },
      latitude: { type: "number" },
      longitude: { type: "number" },
      isDefault: { type: "boolean" },
    },
  },
  UpdateAddressInput: {
    type: "object",
    properties: {
      title: { type: "string" },
      street: { type: "string" },
      city: { type: "string" },
      postalCode: { type: "string" },
      phoneNumber: { type: "string" },
      latitude: { type: "number" },
      longitude: { type: "number" },
      isDefault: { type: "boolean" },
    },
  },
};
