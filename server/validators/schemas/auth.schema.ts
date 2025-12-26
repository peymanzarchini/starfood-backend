import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    firstName: z
      .string({ message: "First name is required" })
      .min(2, "First name must be at least 2 characters long")
      .max(40, "First name must be at most 40 characters long"),
    lastName: z
      .string({ message: "Last name is required" })
      .min(2, "Last name must be at least 2 characters long")
      .max(40, "Last name must be at most 40 characters long"),
    email: z.email("Invalid email address"),
    password: z
      .string({ message: "Password is required" })
      .min(8, "Password must be at least 8 characters long")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    phoneNumber: z
      .string({ message: "Phone number is required" })
      .regex(
        /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
        "Invalid phone number format"
      ),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.email("Invalid email address"),
    password: z.string({ message: "Password is required" }),
  }),
});

export type RegisterInput = z.infer<typeof registerSchema>["body"];
export type LoginInput = z.infer<typeof loginSchema>["body"];
