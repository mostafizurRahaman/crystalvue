// src/app/schemas/contact-us/create-contact-us.ts
import { z } from "zod";

export const createContactUsSchema = z.object({
  fullName: z
    .string()
    .min(1, "Full name is required")
    .max(255, "Full name too long (max 255 characters)")
    .transform((val) => val.trim()),
  phoneNumber: z
    .string()
    .min(1, "Phone number is required")
    .max(20, "Phone number too long (max 20 characters)")
    .transform((val) => val.trim()),
  email: z
    .string()
    .email("Invalid email format")
    .max(255, "Email too long (max 255 characters)")
    .optional(),
  address: z
    .string()
    .min(1, "Address is required")
    .max(1000, "Address too long (max 1000 characters)")
    .transform((val) => val.trim()),
  parentCategoryId: z
    .string()
    .uuid("Invalid category ID format")
    .refine((val) => val !== "", {
      message: "Category selection is required",
    }),
  serviceId: z
    .string()
    .uuid("Invalid service ID format")
    .refine((val) => val !== "", {
      message: "Service selection is required",
    }),
  status: z.enum(["PENDING", "APPROVED", "REJECTED"]).default("PENDING"),
  images: z
    .array(z.string().url("Invalid image URL format"))
    .max(5, "Maximum 5 images allowed")
    .optional()
    .default([]),
  message: z
    .string()
    .min(1, "Message is required")
    .max(2000, "Message too long (max 2000 characters)")
    .transform((val) => val.trim()),
});

export type CreateContactUsType = z.infer<typeof createContactUsSchema>;
