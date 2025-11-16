import { z } from "zod";
import { ImageMetadata } from "@/types/gallery";

export const galleryCategoryEnum = z.enum([
  "SHOWER_ENCLOSURES",
  "GLASS_DOORS",
  "RAILINGS",
  "WINDOWS",
  "UPVC",
]);

export const createGallerySchema = z.object({
  caption: z
    .string()
    .max(255, "Caption too long (max 255 characters)")
    .transform((val) => val.trim())
    .optional(),
  image: z.object({
    url: z.string().url("Invalid image URL"),
    publicId: z.string().min(1, "Image public ID is required"),
    folder: z.string().optional(),
    altText: z.string().optional(),
    width: z.number().int().positive().optional(),
    height: z.number().int().positive().optional(),
    format: z.string().optional(),
    size: z.number().int().positive().optional(),
  }),
  isActive: z.boolean().default(true),
  galleryCategory: galleryCategoryEnum.optional(),
});

export type CreateGalleryType = z.infer<typeof createGallerySchema>;
