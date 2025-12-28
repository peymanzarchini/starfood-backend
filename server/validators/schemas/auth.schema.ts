import { z } from "zod";

/**
 * Password validation regex
 * Requires: 1 uppercase, 1 lowercase, 1 number, min 8 chars
 */
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;

/**
 * Phone number validation regex
 * Supports international format
 */
const phoneRegex = /^\+?[0-9]{10,15}$/;

/**
 * Register user schema
 */
export const registerSchema = z.object({
  body: z.object({
    firstName: z
      .string({ message: "First name is required" })
      .trim()
      .min(2, "First name must be at least 2 characters")
      .max(50, "First name cannot exceed 50 characters"),

    lastName: z
      .string({ message: "Last name is required" })
      .trim()
      .min(2, "Last name must be at least 2 characters")
      .max(50, "Last name cannot exceed 50 characters"),

    email: z.email("Invalid email format").toLowerCase().trim(),

    password: z
      .string({ message: "Password is required" })
      .min(8, "Password must be at least 8 characters")
      .regex(
        passwordRegex,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),

    phoneNumber: z
      .string({ message: "Phone number is required" })
      .regex(phoneRegex, "Invalid phone number format"),
  }),
});

/**
 * Login user schema
 */
export const loginSchema = z.object({
  body: z.object({
    email: z.email("Invalid email format").toLowerCase().trim(),

    password: z.string({ message: "Password is required" }),
  }),
});

/**
 * Change password schema
 */
export const changePasswordSchema = z.object({
  body: z
    .object({
      currentPassword: z.string({ message: "Current password is required" }),

      newPassword: z
        .string({ message: "New password is required" })
        .min(8, "Password must be at least 8 characters")
        .regex(
          passwordRegex,
          "Password must contain at least one uppercase letter, one lowercase letter, and one number"
        ),

      confirmPassword: z.string({ message: "Confirm password is required" }),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }),
});

/**
 * Update profile schema
 */
export const updateProfileSchema = z.object({
  body: z.object({
    firstName: z
      .string()
      .trim()
      .min(2, "First name must be at least 2 characters")
      .max(50, "First name cannot exceed 50 characters")
      .optional(),

    lastName: z
      .string()
      .trim()
      .min(2, "Last name must be at least 2 characters")
      .max(50, "Last name cannot exceed 50 characters")
      .optional(),

    phoneNumber: z.string().regex(phoneRegex, "Invalid phone number format").optional(),
  }),
});

// Type exports
export type RegisterInput = z.infer<typeof registerSchema>["body"];
export type LoginInput = z.infer<typeof loginSchema>["body"];
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>["body"];
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>["body"];
