import { z } from "zod";

// Image metadata schema (matches backend)
export const imageMetadataSchema = z.object(
  {
    id: z.string().uuid("Invalid image ID format").optional(),
    url: z.string().url("Invalid image URL"),
    publicId: z.string().optional().default(""),
    folder: z.string().optional().default("app/uploads"),
    altText: z.string().optional(),
    width: z.number().int().positive().optional(),
    height: z.number().int().positive().optional(),
    format: z.string().optional(),
    size: z.number().int().positive().optional(),
  },
  {
    message: "Image is required",
  }
);

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
    .optional()
    .default(5),
  position: z
    .string()
    .max(255, "Position too long (max 255 characters)")
    .transform((val) => (val ? val.trim() : ""))
    .optional(),
  company: z
    .string()
    .max(255, "Company name too long (max 255 characters)")
    .transform((val) => (val ? val.trim() : ""))
    .optional(),
  image: imageMetadataSchema.optional(),
  isActive: z.boolean().optional().default(true),
});

export type CreateTestimonialSchemaType = z.infer<
  typeof createTestimonialSchema
>;
