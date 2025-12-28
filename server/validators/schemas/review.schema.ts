import { z } from "zod";

/**
 * Create review schema
 */
export const createReviewSchema = z.object({
  body: z.object({
    productId: z
      .number({ message: "Product ID is required" })
      .int("Product ID must be an integer")
      .positive("Product ID must be positive"),

    rating: z
      .number({ message: "Rating is required" })
      .int("Rating must be an integer")
      .min(1, "Rating must be at least 1")
      .max(5, "Rating cannot exceed 5"),

    comment: z.string().trim().max(1000, "Comment cannot exceed 1000 characters").optional(),
  }),
});

/**
 * Update review schema
 */
export const updateReviewSchema = z.object({
  params: z.object({
    id: z
      .string()
      .transform((val) => parseInt(val, 10))
      .refine((val) => !isNaN(val) && val > 0, "Invalid review ID"),
  }),
  body: z.object({
    rating: z
      .number()
      .int("Rating must be an integer")
      .min(1, "Rating must be at least 1")
      .max(5, "Rating cannot exceed 5")
      .optional(),

    comment: z.string().trim().max(1000, "Comment cannot exceed 1000 characters").optional(),
  }),
});

/**
 * Approve review schema (admin only)
 */
export const approveReviewSchema = z.object({
  params: z.object({
    id: z
      .string()
      .transform((val) => parseInt(val, 10))
      .refine((val) => !isNaN(val) && val > 0, "Invalid review ID"),
  }),
  body: z.object({
    isApproved: z.boolean({ message: "Approval status is required" }),
  }),
});

/**
 * Get reviews schema (with filters)
 */
export const getReviewsSchema = z.object({
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

    productId: z
      .string()
      .transform((val) => parseInt(val, 10))
      .refine((val) => !isNaN(val) && val > 0, "Invalid product ID")
      .optional(),

    rating: z
      .string()
      .transform((val) => parseInt(val, 10))
      .refine((val) => !isNaN(val) && val >= 1 && val <= 5, "Rating must be between 1 and 5")
      .optional(),

    isApproved: z
      .string()
      .transform((val) => val === "true")
      .optional(),
  }),
});

// Type exports
export type CreateReviewInput = z.infer<typeof createReviewSchema>["body"];
export type UpdateReviewInput = z.infer<typeof updateReviewSchema>["body"];
export type ApproveReviewInput = z.infer<typeof approveReviewSchema>["body"];
export type GetReviewsQuery = z.infer<typeof getReviewsSchema>["query"];
