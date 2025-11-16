import { z } from "zod";

// Image metadata schema for frontend
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

export const createCategorySchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name too long (max 100 chars)")
    .transform((val) => val.trim()),
  tagline: z
    .string()
    .trim()
    .min(1, "Tagline is required")
    .max(255, "Tagline too long (max 255 chars)"),
  description: z
    .string()
    .trim()
    .min(1, "Description is required")
    .max(1000, "Description too long (max 1000 chars)"),
  cardImage: imageMetadataSchema,
  detailsImage: imageMetadataSchema,
  isPremium: z.boolean().default(false),
  isRepairingService: z.boolean().default(false),
  isShowHome: z.boolean().default(false),
  isActive: z.boolean().default(true),
  sortOrder: z
    .number()
    .int("Sort order must be integer")
    .min(0, "Sort order must be 0 or greater")
    .optional(),
  userId: z.string().optional(),
  addons: z
    .array(
      z
        .string()
        .trim()
        .min(1, "Addon text cannot be empty")
        .max(255, "Addon text too long")
        .transform((val) => val.trim())
    )
    .optional()
    .default([]),
});

export type CreateCategoryType = z.infer<typeof createCategorySchema>;
export type ImageMetadataType = z.infer<typeof imageMetadataSchema>;
