import { z } from "zod";

const imageMetadataSchema = z.object({
  id: z.string().uuid("Invalid image ID format").optional(),
  url: z.string().url("Invalid image URL"),
  publicId: z.string().optional(),
  folder: z.string().optional(),
  altText: z.string().optional(),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
  format: z.string().optional(),
  size: z.number().int().positive().optional(),
});

const blockSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(255, "Title too long")
    .transform((val) => val.trim()),
  content: z
    .string()
    .min(1, "Content is required")
    .transform((val) => val.trim()),
  image: imageMetadataSchema.optional(),
  isActive: z.boolean().optional(),
});

export const updateAboutBlocksSchema = z.object({
  vision: blockSchema,
  mission: blockSchema,
});

export type UpdateAboutBlocksType = z.infer<typeof updateAboutBlocksSchema>;
