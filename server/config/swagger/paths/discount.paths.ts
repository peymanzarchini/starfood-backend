export const discountPaths = {
  "/discounts/validate": {
    post: {
      tags: ["Discounts"],
      summary: "Validate a discount code",
      description:
        "Check if a discount code is valid and calculate the discount amount for a given order",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ValidateDiscountInput" },
            example: {
              code: "WELCOME20",
              orderAmount: 250000,
            },
          },
        },
      },
      responses: {
        200: {
          description: "Validation result",
          content: {
            "application/json": {
              schema: {
                allOf: [
                  { $ref: "#/components/schemas/ApiResponse" },
                  {
                    type: "object",
                    properties: {
                      body: { $ref: "#/components/schemas/ValidateDiscountResponse" },
                    },
                  },
                ],
              },
              example: {
                success: true,
                message: "Discount validation completed",
                body: {
                  isValid: true,
                  discount: {
                    code: "WELCOME20",
                    type: "percentage",
                    value: 20,
                    minOrderAmount: 100000,
                    maxDiscountAmount: 50000,
                  },
                  calculatedDiscount: 50000,
                  message: "20% discount applied - 50,000 تومان off",
                },
                status: 200,
              },
            },
          },
        },
      },
    },
  },
};
