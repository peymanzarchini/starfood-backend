import { z } from "zod";

export const addToCartSchema = z.object({
  body: z.object({
    productId: z.number({ message: "Product ID must be a number" }).int().positive(),
    quantity: z.number().int().positive().default(1),
  }),
});

export const updateCartItemSchema = z.object({
  params: z.object({
    itemId: z.string().transform((val) => parseInt(val, 10)),
  }),
  body: z.object({
    quantity: z.number().int().positive(),
  }),
});

export type AddToCartInput = z.infer<typeof addToCartSchema>["body"];
export type UpdateCartItemInput = z.infer<typeof updateCartItemSchema>["body"];
