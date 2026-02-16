import { z } from "zod";

/**
 * Discount type values
 */
export const discountTypeValues = ["percentage", "fixed"] as const;
export type DiscountType = (typeof discountTypeValues)[number];

/**
 * Create discount schema (admin only)
 */
export const createDiscountSchema = z.object({
  body: z
    .object({
      code: z
        .string({ message: "Discount code is required" })
        .trim()
        .toUpperCase()
        .min(3, "Discount code must be at least 3 characters")
        .max(50, "Discount code cannot exceed 50 characters"),

      type: z
        .enum(discountTypeValues, {
          message: "Type must be 'percentage' or 'fixed'",
        })
        .default("percentage"),

      value: z
        .number({ message: "Discount value is required" })
        .positive("Discount value must be greater than 0")
        .refine((val) => val <= 100 || val > 100, "For percentage type, value cannot exceed 100"),

      minOrderAmount: z
        .number()
        .min(0, "Minimum order amount cannot be negative")
        .optional()
        .default(0),

      maxDiscountAmount: z
        .number()
        .min(0, "Maximum discount amount cannot be negative")
        .optional()
        .nullable(),

      usageLimit: z
        .number()
        .int("Usage limit must be an integer")
        .min(1, "Usage limit must be at least 1")
        .optional()
        .default(1),

      startDate: z
        .string()
        .datetime({ message: "Invalid start date format" })
        .transform((val) => new Date(val))
        .optional(),

      expireDate: z
        .string({ message: "Expire date is required" })
        .datetime({ message: "Invalid expire date format" })
        .transform((val) => new Date(val)),

      isActive: z.boolean().optional().default(true),
    })
    .refine(
      (data) => !data.startDate || data.expireDate > data.startDate,
      "Expire date must be after start date",
    )
    .refine(
      (data) => data.type !== "percentage" || data.value <= 100,
      "Percentage discount cannot exceed 100%",
    ),
});

/**
 * Update discount schema (admin only)
 */
export const updateDiscountSchema = z.object({
  params: z.object({
    id: z
      .string()
      .transform((val) => parseInt(val, 10))
      .refine((val) => !isNaN(val) && val > 0, "Invalid discount ID"),
  }),
  body: z
    .object({
      code: z
        .string()
        .trim()
        .toUpperCase()
        .min(3, "Discount code must be at least 3 characters")
        .max(50, "Discount code cannot exceed 50 characters")
        .optional(),

      type: z
        .enum(discountTypeValues, {
          message: "Type must be 'percentage' or 'fixed'",
        })
        .optional(),

      value: z.number().positive("Discount value must be greater than 0").optional(),

      minOrderAmount: z.number().min(0, "Minimum order amount cannot be negative").optional(),

      maxDiscountAmount: z
        .number()
        .min(0, "Maximum discount amount cannot be negative")
        .optional()
        .nullable(),

      usageLimit: z
        .number()
        .int("Usage limit must be an integer")
        .min(1, "Usage limit must be at least 1")
        .optional(),

      startDate: z
        .string()
        .datetime({ message: "Invalid start date format" })
        .transform((val) => new Date(val))
        .optional(),

      expireDate: z
        .string()
        .datetime({ message: "Invalid expire date format" })
        .transform((val) => new Date(val))
        .optional(),

      isActive: z.boolean().optional(),
    })
    .refine(
      (data) => data.type !== "percentage" || !data.value || data.value <= 100,
      "Percentage discount cannot exceed 100%",
    ),
});

/**
 * Get discount by ID schema
 */
export const getDiscountByIdSchema = z.object({
  params: z.object({
    id: z
      .string()
      .transform((val) => parseInt(val, 10))
      .refine((val) => !isNaN(val) && val > 0, "Invalid discount ID"),
  }),
});

/**
 * Validate discount code schema (public)
 */
export const validateDiscountSchema = z.object({
  body: z.object({
    code: z
      .string({ message: "Discount code is required" })
      .trim()
      .toUpperCase()
      .min(3, "Discount code must be at least 3 characters"),

    orderAmount: z
      .number({ message: "Order amount is required" })
      .min(0, "Order amount cannot be negative"),
  }),
});

/**
 * Get discounts list schema (admin)
 */
export const getDiscountsSchema = z.object({
  query: z.object({
    page: z
      .string()
      .optional()
      .default("1")
      .transform((val) => parseInt(val, 10))
      .refine((val) => !isNaN(val) && val > 0, "Page must be positive"),

    limit: z
      .string()
      .optional()
      .default("10")
      .transform((val) => parseInt(val, 10))
      .refine((val) => !isNaN(val) && val > 0 && val <= 100, "Limit must be between 1 and 100"),

    isActive: z
      .string()
      .transform((val) => val === "true")
      .optional(),

    search: z.string().trim().min(1).optional(),
  }),
});

// Type exports
export type CreateDiscountInput = z.infer<typeof createDiscountSchema>["body"];
export type UpdateDiscountInput = z.infer<typeof updateDiscountSchema>["body"];
export type ValidateDiscountInput = z.infer<typeof validateDiscountSchema>["body"];
export type GetDiscountsQuery = z.infer<typeof getDiscountsSchema>["query"];
