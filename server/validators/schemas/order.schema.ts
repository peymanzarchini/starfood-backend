import { z } from "zod";

export const createOrderSchema = z.object({
  body: z.object({
    addressId: z.number({ message: "Address Id is required" }).int().positive(),
    discountCode: z.string().optional(),
    notes: z.string().max(500).optional(),
  }),
});

export const updateOrderStatusSchema = z.object({
  params: z.object({
    id: z.string().transform((val) => parseInt(val, 10)),
  }),
  body: z.object({
    status: z.enum(["pending", "preparing", "delivering", "completed", "cancelled"]),
  }),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>["body"];
