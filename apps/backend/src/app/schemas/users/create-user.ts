import { z } from "zod";

export const createUserSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(255, "Name too long (max 255 characters)")
    .transform((val) => val.trim()),
  email: z
    .string()
    .min(1, "Email is required")
    .max(255, "Email too long (max 255 characters)")
    .email("Invalid email format")
    .transform((val) => val.trim().toLowerCase()),
  role: z.enum(["admin", "superadmin"], {
    message: "Role must be 'admin' or 'superadmin'",
  }),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(100, "Password too long (max 100 characters)"),
  profileUrl: z
    .string()
    .url("Invalid profile URL format")
    .nullable()
    .optional(),
  userStatus: z.enum(["active", "pending", "blocked"]).default("pending"),
});

export type CreateUserType = z.infer<typeof createUserSchema>;
