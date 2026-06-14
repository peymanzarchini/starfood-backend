import { z } from "zod";

export const orderStatusValues = [
  "pending",
  "confirmed",
  "preparing",
  "ready",
  "delivering",
  "delivered",
  "cancelled",
] as const;

export type OrderStatusType = (typeof orderStatusValues)[number];

export const createOrderSchema = z.object({
  body: z.object({
    addressId: z
      .number({ message: "Address ID is required" })
      .int("Address ID must be an integer")
      .positive("Address ID must be positive"),
    discountCode: z
      .string()
      .trim()
      .toUpperCase()
      .transform((val) => (val === "" ? undefined : val))
      .optional(),
    notes: z.string().trim().max(500, "Notes cannot exceed 500 characters").optional(),
  }),
});

export const updateOrderStatusSchema = z.object({
  params: z.object({
    id: z
      .string()
      .transform((val) => parseInt(val, 10))
      .refine((val) => !isNaN(val) && val > 0, "Invalid order ID"),
  }),
  body: z.object({
    status: z.enum(orderStatusValues, {
      message: "Invalid order status",
    }),
    estimatedDelivery: z
      .string()
      .datetime({ message: "Invalid datetime format" })
      .transform((val) => new Date(val))
      .optional(),
  }),
});

export const getOrderSchema = z.object({
  params: z.object({
    id: z
      .string()
      .transform((val) => parseInt(val, 10))
      .refine((val) => !isNaN(val) && val > 0, "Invalid order ID"),
  }),
});

export const getOrdersSchema = z.object({
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
    status: z.enum(orderStatusValues, { message: "Invalid order status" }).optional(),
    startDate: z.string().datetime({ message: "Invalid start date format" }).optional(),
    endDate: z.string().datetime({ message: "Invalid end date format" }).optional(),
    search: z.string().trim().min(1).optional(),
  }),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>["body"];
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>["body"];
export type UpdateOrderStatusParams = z.infer<typeof updateOrderStatusSchema>["params"];
export type GetOrdersQuery = z.infer<typeof getOrdersSchema>["query"];
