import { z } from "zod";

export const addToCartSchema = z.object({
  body: z.object({
    productId: z
      .number({ message: "Product ID is required" })
      .int("Product ID must be an integer")
      .positive("Product ID must be positive"),

    quantity: z
      .number()
      .int("Quantity must be an integer")
      .positive("Quantity must be positive")
      .max(99, "Quantity cannot exceed 99")
      .default(1),
  }),
});

export const updateCartItemSchema = z.object({
  params: z.object({
    itemId: z
      .string()
      .transform((val) => parseInt(val, 10))
      .refine((val) => !isNaN(val) && val > 0, "Invalid item ID"),
  }),
  body: z.object({
    quantity: z
      .number({ message: "Quantity is required" })
      .int("Quantity must be an integer")
      .positive("Quantity must be positive")
      .max(99, "Quantity cannot exceed 99"),
  }),
});

export const removeCartItemSchema = z.object({
  params: z.object({
    itemId: z
      .string()
      .transform((val) => parseInt(val, 10))
      .refine((val) => !isNaN(val) && val > 0, "Invalid item ID"),
  }),
});

export type AddToCartInput = z.infer<typeof addToCartSchema>["body"];
export type UpdateCartItemInput = z.infer<typeof updateCartItemSchema>["body"];
export type UpdateCartItemParams = z.infer<typeof updateCartItemSchema>["params"];
