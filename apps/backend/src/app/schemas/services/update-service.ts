// src/app/schemas/services/update-service.ts
import { z } from "zod";
import { imageMetadataSchema } from "../shared/image-metadata";

export const updateServiceParamsSchema = z.object({
  id: z.string().uuid("Invalid service ID format"),
});

export const updateServiceSchema = z
  .object({
    name: z
      .string()
      .min(1, "Name is required")
      .max(100, "Name too long (max 100 chars)")
      .transform((val) => val.trim())
      .optional(),
    tagline: z.string().max(255, "Tagline too long (max 255 chars)").optional(),
    description: z
      .string()
      .max(1000, "Description too long (max 1000 chars)")
      .optional(),
    image: imageMetadataSchema.optional(),
    price: z.number().positive("Price must be positive").optional(),
    isPremium: z.boolean().optional(),
    isActive: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  });

export type UpdateServiceType = z.infer<typeof updateServiceSchema>;
export type UpdateServiceParamsType = z.infer<typeof updateServiceParamsSchema>;
