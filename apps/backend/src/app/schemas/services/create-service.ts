// src/app/schemas/services/create-service.ts
import { z } from "zod";
import { imageMetadataSchema } from "../shared/image-metadata";

export const createServiceSchema = z.object({
  parentCategoryId: z.string().uuid("Invalid category ID format"),
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
  image: imageMetadataSchema,
  price: z.number().positive("Price must be positive").optional(),
  isPremium: z.boolean().default(false),
  isActive: z.boolean().default(true),
});

export type CreateServiceType = z.infer<typeof createServiceSchema>;
