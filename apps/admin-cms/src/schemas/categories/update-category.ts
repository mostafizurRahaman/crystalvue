import { z } from "zod";
import { imageMetadataSchema } from "./create-category";

export const updateCategoryParamsSchema = z.object({
  id: z.string().uuid("Invalid category ID format"),
});

export const updateCategorySchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  tagline: z
    .string()
    .trim()
    .min(1, "Tagline is required")
    .max(255, "Tagline too long (max 255 chars)"),
  description: z
    .string()
    .trim()
    .max(1000, "Description too long (max 1000 chars)"),
  cardImage: imageMetadataSchema.optional(),
  detailsImage: imageMetadataSchema.optional(),
  isPremium: z.boolean(),
  isRepairingService: z.boolean(),
  isShowHome: z.boolean(),
  isActive: z.boolean(),
  sortOrder: z.number().int().positive().optional(), // ✅ Make optional
  userId: z.string().optional(), // ✅ Make optional too
  addons: z.array(z.string().min(1, "Addon text cannot be empty")),
});

export type UpdateCategoryParamsType = z.infer<
  typeof updateCategoryParamsSchema
>;
export type UpdateCategoryType = z.infer<typeof updateCategorySchema>;
