// src/app/schemas/categories/update-category.ts
import { z } from "zod";
import { imageMetadataSchema } from "../shared/image-metadata";

export const updateCategoryParamsSchema = z.object({
  id: z.string().uuid("Invalid category ID format"),
});

export const updateCategorySchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  tagline: z.string().optional(),
  description: z.string().optional(),
  cardImage: imageMetadataSchema.optional(),
  detailsImage: imageMetadataSchema.optional(),
  isPremium: z.boolean().optional(),
  isRepairingService: z.boolean().optional(),
  isShowHome: z.boolean().optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
  userId: z
    .string({
      error: "Invalid user ID format",
    })
    .optional(),
  addons: z.array(z.string().min(1, "Addon text cannot be empty")).optional(),
});

export type UpdateCategoryParamsType = z.infer<
  typeof updateCategoryParamsSchema
>;
export type UpdateCategoryType = z.infer<typeof updateCategorySchema>;
