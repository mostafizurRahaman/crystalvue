import { z } from "zod";

// Schema for URL parameters
export const updateUserParamsSchema = z.object({
  id: z.string().uuid("Invalid user ID format"),
});

// Schema for request body
export const updateUserSchema = z
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
    role: z
      .enum(["admin", "superadmin"], {
        message: "Role must be 'admin' or 'superadmin'",
      })
      .optional(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .max(100, "Password too long (max 100 characters)")
      .optional(),
    profileUrl: z
      .string()
      .url("Invalid profile URL format")
      .nullable()
      .optional(),
    userStatus: z.enum(["active", "pending", "blocked"]).optional(),
  })
  .refine(
    (data) => {
      // At least one field must be provided for update
      return Object.keys(data).length > 0;
    },
    {
      message: "At least one field must be provided for update",
    },
  );

export type UpdateUserType = z.infer<typeof updateUserSchema>;
export type UpdateUserParamsType = z.infer<typeof updateUserParamsSchema>;
