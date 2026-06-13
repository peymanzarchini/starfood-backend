import { z } from "zod";

export const createCategorySchema = z.object({
  body: z.object({
    name: z
      .string({ message: "Category name is required" })
      .trim()
      .min(2, "Category name must be at least 2 characters")
      .max(50, "Category name cannot exceed 50 characters"),

    description: z.string().trim().max(500, "Description cannot exceed 500 characters").optional(),

    imageUrl: z.preprocess(
      (val) => (val === "" ? undefined : val),
      z.url("Invalid image URL").optional(),
    ),

    displayOrder: z
      .number()
      .int("Display order must be an integer")
      .nonnegative("Display order cannot be negative")
      .optional()
      .default(0),

    isActive: z.boolean().optional().default(true),
  }),
});

export const updateCategorySchema = z.object({
  params: z.object({
    id: z
      .string()
      .transform((val) => parseInt(val, 10))
      .refine((val) => !isNaN(val) && val > 0, "Invalid category ID"),
  }),
  body: createCategorySchema.shape.body.partial(),
});

export const getCategoryByIdSchema = z.object({
  params: z.object({
    id: z
      .string()
      .transform((val) => parseInt(val, 10))
      .refine((val) => !isNaN(val) && val > 0, "Invalid category ID"),
  }),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>["body"];
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>["body"];
export type UpdateCategoryParams = z.infer<typeof updateCategorySchema>["params"];
