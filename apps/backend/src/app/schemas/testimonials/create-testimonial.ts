import { z } from "zod";

export const createTestimonialSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(255, "Name too long (max 255 characters)")
    .transform((val) => val.trim()),
  message: z
    .string()
    .min(1, "Message is required")
    .max(1000, "Message too long (max 1000 characters)")
    .transform((val) => val.trim()),
  rating: z
    .number()
    .int("Rating must be an integer")
    .min(1, "Rating must be at least 1")
    .max(5, "Rating cannot exceed 5")
    .default(5),
  position: z
    .string()
    .max(255, "Position too long (max 255 characters)")
    .transform((val) => val.trim())
    .optional(),
  company: z
    .string()
    .max(255, "Company name too long (max 255 characters)")
    .transform((val) => val.trim())
    .optional(),
  image: z
    .object({
      url: z.string().url("Invalid image URL"),
      publicId: z.string().min(1, "Image public ID is required"),
      folder: z.string().optional(),
      altText: z.string().optional(),
      width: z.number().int().positive().optional(),
      height: z.number().int().positive().optional(),
      format: z.string().optional(),
      size: z.number().int().positive().optional(),
    })
    .optional(),
  isActive: z.boolean().default(true),
});

export type CreateTestimonialType = z.infer<typeof createTestimonialSchema>;
