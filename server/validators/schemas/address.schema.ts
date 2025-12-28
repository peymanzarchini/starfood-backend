import { z } from "zod";

/**
 * Phone number regex (international format)
 */
const phoneRegex = /^\+?[0-9]{10,15}$/;

/**
 * Postal code regex
 */
const postalCodeRegex = /^[a-zA-Z0-9\s\\-]{3,20}$/;

/**
 * Create address schema
 */
export const createAddressSchema = z.object({
  body: z.object({
    title: z
      .string({ message: "Address title is required" })
      .trim()
      .min(2, "Title must be at least 2 characters")
      .max(50, "Title cannot exceed 50 characters"),

    street: z
      .string({ message: "Street is required" })
      .trim()
      .min(5, "Street must be at least 5 characters")
      .max(255, "Street cannot exceed 255 characters"),

    city: z
      .string({ message: "City is required" })
      .trim()
      .min(2, "City must be at least 2 characters")
      .max(100, "City cannot exceed 100 characters"),

    postalCode: z.string().regex(postalCodeRegex, "Invalid postal code format").optional(),

    phoneNumber: z
      .string({ message: "Phone number is required" })
      .regex(phoneRegex, "Invalid phone number format"),

    latitude: z
      .number()
      .min(-90, "Latitude must be between -90 and 90")
      .max(90, "Latitude must be between -90 and 90")
      .optional(),

    longitude: z
      .number()
      .min(-180, "Longitude must be between -180 and 180")
      .max(180, "Longitude must be between -180 and 180")
      .optional(),

    isDefault: z.boolean().optional().default(false),
  }),
});

/**
 * Update address schema
 */
export const updateAddressSchema = z.object({
  params: z.object({
    id: z
      .string()
      .transform((val) => parseInt(val, 10))
      .refine((val) => !isNaN(val) && val > 0, "Invalid address ID"),
  }),
  body: createAddressSchema.shape.body.partial(),
});

/**
 * Get address by ID schema
 */
export const getAddressByIdSchema = z.object({
  params: z.object({
    id: z
      .string()
      .transform((val) => parseInt(val, 10))
      .refine((val) => !isNaN(val) && val > 0, "Invalid address ID"),
  }),
});

// Type exports
export type CreateAddressInput = z.infer<typeof createAddressSchema>["body"];
export type UpdateAddressInput = z.infer<typeof updateAddressSchema>["body"];
export type UpdateAddressParams = z.infer<typeof updateAddressSchema>["params"];
