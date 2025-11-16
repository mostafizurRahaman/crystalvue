// src/app/schemas/categories/create-category.ts
import { z } from "zod";
import { imageMetadataSchema } from "../shared/image-metadata";

export const createCategorySchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name too long (max 100 chars)")
    .transform((val) => val.trim()),
  tagline: z.string().max(255, "Tagline too long (max 255 chars)").optional(),
  description: z
    .string()
    .max(1000, "Description too long (max 1000 chars)")
    .optional(),
  cardImage: imageMetadataSchema.optional(),
  detailsImage: imageMetadataSchema.optional(),
  isPremium: z.boolean().default(false),
  isRepairingService: z.boolean().default(false),
  isShowHome: z.boolean().default(false),
  isActive: z.boolean().default(true),
  sortOrder: z
    .number()
    .int("Sort order must be integer")
    .min(0, "Sort order must be 0 or greater")
    .optional(),
  userId: z
    .string({
      error: "Invalid user ID format",
    })
    .optional(),
  addons: z
    .array(
      z
        .string()
        .min(1, "Addon text cannot be empty")
        .max(255, "Addon text too long")
        .transform((val) => val.trim())
    )
    .optional()
    .default([]),
});

export type CreateCategoryType = z.infer<typeof createCategorySchema>;
