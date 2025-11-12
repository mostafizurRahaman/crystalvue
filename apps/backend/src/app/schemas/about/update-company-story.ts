import { z } from "zod";
import { imageMetadataSchema } from "../shared/image-metadata";

export const updateCompanyStorySchema = z.object({
  title: z
    .string()
    .max(255, "Title too long")
    .transform((val) => val?.trim())
    .optional(),
  content: z
    .string()
    .min(1, "Content is required")
    .transform((val) => val.trim()),
  leftImage: imageMetadataSchema.optional(),
  isActive: z.boolean().optional(),
});

export type UpdateCompanyStoryType = z.infer<typeof updateCompanyStorySchema>;
