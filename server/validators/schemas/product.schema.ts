import { z } from "zod";

export const createProductSchema = z.object({
  body: z.object({
    name: z
      .string({ message: "Product name is required" })
      .min(2, "Product name must be at least 2 characters long")
      .max(100, "Product name must be at most 100 characters long"),
    description: z
      .string({ message: "Description is required" })
      .min(10, "Description must be at least 10 characters long"),
    price: z.number({ message: "Price is required" }).positive("Price must be a positive number"),
    categoryId: z.number({ message: "Category Id is required" }).int().positive(),
    imageUrl: z.url("Invalid image URL").optional(),
    ingredients: z.array(z.string()).optional(),
    preparationTime: z.number().int().positive().optional(),
    calories: z.number().int().positive().optional(),
    isAvailable: z.boolean().default(true),
  }),
});

export const updateProductSchema = z.object({
  params: z.object({
    id: z.string().transform((val) => parseInt(val, 10)),
  }),
  body: createProductSchema.shape.body.partial(),
});

export const getProductSchema = z.object({
  query: z.object({
    page: z
      .string()
      .transform((val) => parseInt(val, 10))
      .default(1),
    limit: z
      .string()
      .transform((val) => parseInt(val, 10))
      .default(10),
    categoryId: z
      .string()
      .transform((val) => parseInt(val, 10))
      .optional(),
    minPrice: z
      .string()
      .transform((val) => parseFloat(val))
      .optional(),
    maxPrice: z
      .string()
      .transform((val) => parseFloat(val))
      .optional(),
    search: z.string().optional(),
    sortBy: z.enum(["price", "createdAt", "name"]).default("createdAt"),
    sortOrder: z.enum(["asc", "desc"]).default("desc"),
  }),
});

export type CreateProductInput = z.infer<typeof createProductSchema>["body"];
export type UpdateProductInput = z.infer<typeof updateProductSchema>["body"];
export type GetProductsQuery = z.infer<typeof getProductSchema>["query"];
