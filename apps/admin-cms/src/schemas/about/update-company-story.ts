import { z } from "zod";

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
  leftImage: z
    .object({
      id: z.string().uuid("Invalid image ID format").optional(),
      url: z.string().url("Invalid image URL"),
      publicId: z.string().optional(),
      folder: z.string().optional(),
      altText: z.string().optional(),
      width: z.number().int().positive().optional(),
      height: z.number().int().positive().optional(),
      format: z.string().optional(),
      size: z.number().int().positive().optional(),
    })
    .optional(),
  isActive: z.boolean().optional(),
});

export type UpdateCompanyStoryType = z.infer<typeof updateCompanyStorySchema>;
