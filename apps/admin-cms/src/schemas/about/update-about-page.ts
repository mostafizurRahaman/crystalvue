import { z } from "zod";

export const updateAboutPageSchema = z.object({
  introTitle: z
    .string()
    .min(1, "Intro title is required")
    .max(255, "Intro title too long (max 255 characters)")
    .transform((val) => val.trim())
    .optional(),
  introSubtitle: z
    .string()
    .max(500, "Intro subtitle too long (max 500 characters)")
    .transform((val) => val.trim())
    .optional(),
  heroText: z
    .string()
    .max(1000, "Hero text too long (max 1000 characters)")
    .transform((val) => val.trim())
    .optional(),
  bannerImage: z
    .object({
      url: z.string().url("Invalid banner image URL"),
      publicId: z.string().min(1, "Banner image public ID is required"),
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

export type UpdateAboutPageType = z.infer<typeof updateAboutPageSchema>;
