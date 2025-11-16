import { z } from "zod";
import { imageMetadataSchema } from "../shared/image-metadata";

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
