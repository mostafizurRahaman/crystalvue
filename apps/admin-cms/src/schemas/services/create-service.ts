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

export const createServiceSchema = z.object({
  parentCategoryId: z.string().uuid("Invalid category ID format"),
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name too long (max 100 chars)")
    .transform((val) => val.trim()),
  tagline: z
    .string()
    .max(255, "Tagline too long (max 255 chars)")
    .transform((val) => val.trim()),
  description: z
    .string()
    .max(1000, "Description too long (max 1000 chars)")
    .transform((val) => val.trim()),
  image: imageMetadataSchema,
  price: z.number().positive("Price must be positive").default(0),
  isPremium: z.boolean().optional().default(false),
  isActive: z.boolean().optional().default(true),
});

export type CreateServiceSchemaType = z.infer<typeof createServiceSchema>;
