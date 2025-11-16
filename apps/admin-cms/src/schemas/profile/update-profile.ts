import { z } from "zod";

// Schema for profile update (name, email)
export const profileUpdateSchema = z
  .object({
    name: z
      .string()
      .min(1, "Name is required")
      .max(255, "Name too long (max 255 characters)")
      .transform((val) => val.trim())
      .optional(),
    email: z
      .string()
      .min(1, "Email is required")
      .max(255, "Email too long (max 255 characters)")
      .email("Invalid email format")
      .transform((val) => val.trim().toLowerCase())
      .optional(),
  })
  .refine(
    (data) => {
      // At least one field must be provided for update
      return data.name || data.email;
    },
    {
      message: "At least one field must be provided for update",
    }
  );

export type ProfileUpdateFormData = z.infer<typeof profileUpdateSchema>;

// Schema for password change
export const passwordChangeSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .max(100, "Password too long (max 100 characters)"),
    confirmPassword: z.string(),
  })
  .refine(
    (data) => {
      // Passwords must match
      return data.password === data.confirmPassword;
    },
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }
  );

export type PasswordChangeFormData = z.infer<typeof passwordChangeSchema>;
