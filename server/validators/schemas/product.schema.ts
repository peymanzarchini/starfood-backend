import { z } from "zod";

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

    imageUrl: z
      .union([z.string().url("Invalid image URL"), z.null()])
      .optional()
      .default(null),

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

export const updateProductSchema = z.object({
  params: z.object({
    id: z
      .string()
      .transform((val) => parseInt(val, 10))
      .refine((val) => !isNaN(val) && val > 0, "Invalid product ID"),
  }),
  body: z.object({
    name: z
      .string()
      .trim()
      .min(2, "Product name must be at least 2 characters")
      .max(100, "Product name cannot exceed 100 characters")
      .optional(),

    description: z.string().trim().min(10, "Description must be at least 10 characters").optional(),

    price: z.number().positive("Price must be a positive number").optional(),

    categoryId: z
      .number()
      .int("Category ID must be an integer")
      .positive("Category ID must be positive")
      .optional(),

    imageUrl: z.union([z.string().url("Invalid image URL"), z.null()]).optional(),

    ingredients: z.array(z.string().trim()).optional(),

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
      .optional(),

    isAvailable: z.boolean().optional(),

    isPopular: z.boolean().optional(),
  }),
});

export const getProductByIdSchema = z.object({
  params: z.object({
    id: z
      .string()
      .transform((val) => parseInt(val, 10))
      .refine((val) => !isNaN(val) && val > 0, "Invalid product ID"),
  }),
});

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

export const addProductImagesSchema = z.object({
  params: z.object({
    id: z
      .string()
      .transform((val) => parseInt(val, 10))
      .refine((val) => !isNaN(val) && val > 0, "Invalid product ID"),
  }),
  body: z.object({
    images: z
      .array(
        z.object({
          url: z.string().url("Invalid image URL format"),
          thumbnailUrl: z.string().url("Invalid thumbnail URL format").optional(),
          altText: z.string().trim().max(255, "Alt text cannot exceed 255 characters").optional(),
        }),
      )
      .min(1, "At least one image is required")
      .max(10, "Cannot add more than 10 images at once"),
  }),
});

export const updateProductImageSchema = z.object({
  params: z.object({
    imageId: z
      .string()
      .transform((val) => parseInt(val, 10))
      .refine((val) => !isNaN(val) && val > 0, "Invalid image ID"),
  }),
  body: z
    .object({
      url: z.string().url("Invalid image URL format").optional(),
      thumbnailUrl: z.union([z.string().url("Invalid thumbnail URL format"), z.null()]).optional(),
      altText: z
        .union([z.string().trim().max(255, "Alt text cannot exceed 255 characters"), z.null()])
        .optional(),
    })
    .refine(
      (data) =>
        data.url !== undefined || data.thumbnailUrl !== undefined || data.altText !== undefined,
      {
        message: "At least one field must be provided to update",
      },
    ),
});

export const deleteProductImageSchema = z.object({
  params: z.object({
    imageId: z
      .string()
      .transform((val) => parseInt(val, 10))
      .refine((val) => !isNaN(val) && val > 0, "Invalid image ID"),
  }),
});

export const setCoverImageSchema = z.object({
  params: z.object({
    id: z
      .string()
      .transform((val) => parseInt(val, 10))
      .refine((val) => !isNaN(val) && val > 0, "Invalid product ID"),
    imageId: z
      .string()
      .transform((val) => parseInt(val, 10))
      .refine((val) => !isNaN(val) && val > 0, "Invalid image ID"),
  }),
});

export const reorderProductImagesSchema = z.object({
  params: z.object({
    id: z
      .string()
      .transform((val) => parseInt(val, 10))
      .refine((val) => !isNaN(val) && val > 0, "Invalid product ID"),
  }),
  body: z.object({
    orderedIds: z
      .array(z.number().int().positive())
      .min(1, "At least one image ID is required")
      .refine((ids) => new Set(ids).size === ids.length, {
        message: "Image IDs must be unique",
      }),
  }),
});

export type CreateProductInput = z.infer<typeof createProductSchema>["body"];
export type UpdateProductInput = z.infer<typeof updateProductSchema>["body"];
export type UpdateProductParams = z.infer<typeof updateProductSchema>["params"];
export type GetProductsQuery = z.infer<typeof getProductsSchema>["query"];
export type AddProductImagesInput = z.infer<typeof addProductImagesSchema>["body"];
export type UpdateProductImageInput = z.infer<typeof updateProductImageSchema>["body"];
