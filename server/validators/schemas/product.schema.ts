import { z } from "zod";

/**
 * Create product schema (admin only)
 */
export const createProductSchema = z.object({
  body: z.object({
    name: z
      .string({ message: "Product name is required" })
      .trim()
      .min(2, "Product name must be at least 2 characters")
      .max(100, "Product name cannot exceed 100 characters"),

    description: z
      .string({ message: "Description is required" })
      .trim()
      .min(10, "Description must be at least 10 characters"),

    price: z.number({ message: "Price is required" }).positive("Price must be a positive number"),

    categoryId: z
      .number({ message: "Category ID is required" })
      .int("Category ID must be an integer")
      .positive("Category ID must be positive"),

    imageUrl: z.string().url("Invalid image URL").optional(),

    ingredients: z.array(z.string().trim()).optional().default([]),

    preparationTime: z
      .number()
      .int("Preparation time must be an integer")
      .positive("Preparation time must be positive")
      .optional(),

    calories: z
      .number()
      .int("Calories must be an integer")
      .nonnegative("Calories cannot be negative")
      .optional(),

    discount: z
      .number()
      .int("Discount must be an integer")
      .min(0, "Discount cannot be less than 0")
      .max(100, "Discount cannot exceed 100")
      .optional()
      .default(0),

    isAvailable: z.boolean().optional().default(true),

    isPopular: z.boolean().optional().default(false),
  }),
});

/**
 * Update product schema (admin only)
 */
export const updateProductSchema = z.object({
  params: z.object({
    id: z
      .string()
      .transform((val) => parseInt(val, 10))
      .refine((val) => !isNaN(val) && val > 0, "Invalid product ID"),
  }),
  body: createProductSchema.shape.body.partial(),
});

/**
 * Get single product schema
 */
export const getProductByIdSchema = z.object({
  params: z.object({
    id: z
      .string()
      .transform((val) => parseInt(val, 10))
      .refine((val) => !isNaN(val) && val > 0, "Invalid product ID"),
  }),
});

/**
 * Get products list schema (with filters and pagination)
 */
export const getProductsSchema = z.object({
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

    categoryId: z
      .string()
      .transform((val) => parseInt(val, 10))
      .refine((val) => !isNaN(val) && val > 0, "Invalid category ID")
      .optional(),

    minPrice: z
      .string()
      .transform((val) => parseFloat(val))
      .refine((val) => !isNaN(val) && val >= 0, "Min price must be non-negative")
      .optional(),

    maxPrice: z
      .string()
      .transform((val) => parseFloat(val))
      .refine((val) => !isNaN(val) && val >= 0, "Max price must be non-negative")
      .optional(),

    search: z.string().trim().min(1, "Search query cannot be empty").optional(),

    isAvailable: z
      .string()
      .transform((val) => val === "true")
      .optional(),

    isPopular: z
      .string()
      .transform((val) => val === "true")
      .optional(),

    sortBy: z.enum(["price", "createdAt", "name", "discount"]).optional().default("createdAt"),

    sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
  }),
});

// Type exports
export type CreateProductInput = z.infer<typeof createProductSchema>["body"];
export type UpdateProductInput = z.infer<typeof updateProductSchema>["body"];
export type UpdateProductParams = z.infer<typeof updateProductSchema>["params"];
export type GetProductsQuery = z.infer<typeof getProductsSchema>["query"];
