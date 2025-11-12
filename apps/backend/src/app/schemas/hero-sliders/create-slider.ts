import * as z from "zod";
// Common timestamp schema (you can reuse this in other models)
export const timestampSchema = {
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
};

// Image metadata schema for Cloudinary
export const imageMetadataSchema = z.object({
  id: z.string().uuid("Invalid image ID format").optional(),
  url: z.string().url("Invalid image URL"),
  publicId: z.string().optional().default(""),
  folder: z.string().optional().default("app/hero-sliders"),
  altText: z.string().optional(),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
  format: z.string().optional(),
  size: z.number().int().positive().optional(),
});

// Base schema for hero slider
export const createHeroSliderSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(255, "Title too long (max 255 chars)"),
  subtitle: z.string().max(255, "Subtitle too long (max 255 chars)").optional(),
  buttonText: z
    .string()
    .max(100, "Button text too long (max 100 chars)")
    .optional(),
  buttonUrl: z
    .string()
    .max(255, "Button URL too long (max 255 chars)")
    .optional(), // path only
  image: imageMetadataSchema,
  isActive: z.boolean().default(true),
  orderNumber: z
    .number()
    .int("Order number must be integer")
    .min(1, "Order number must be positive")
    .optional(),

  userId: z.string().uuid("Invalid user ID format").optional().nullable(),
});

export type createHeroSliderType = (typeof createHeroSliderSchema)["_output"];

// ✅ For update (PATCH)
export const updateHeroSliderSchema = createHeroSliderSchema.partial();
