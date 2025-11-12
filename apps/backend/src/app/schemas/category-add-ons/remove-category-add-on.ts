// src/app/schemas/category-add-ons/remove-category-add-on.ts
import { z } from "zod";

export const removeCategoryAddOnParamsSchema = z.object({
  id: z.string().uuid("Invalid category ID format"),
});

export const removeCategoryAddOnBodySchema = z
  .object({
    addonIds: z
      .array(z.string().uuid("Invalid addon ID format"))
      .min(1, "At least one addon ID required")
      .optional(),
    addonTexts: z
      .array(
        z
          .string()
          .min(1, "Addon text cannot be empty")
          .transform((val) => val.trim()),
      )
      .min(1, "At least one addon text required")
      .optional(),
  })
  .refine((data) => data.addonIds || data.addonTexts, {
    message: "Either addonIds or addonTexts must be provided",
    path: ["body"],
  })
  .refine((data) => !(data.addonIds && data.addonTexts), {
    message: "Provide either addonIds or addonTexts, not both",
    path: ["body"],
  });

export type RemoveCategoryAddOnParamsType = z.infer<
  typeof removeCategoryAddOnParamsSchema
>;
export type RemoveCategoryAddOnBodyType = z.infer<
  typeof removeCategoryAddOnBodySchema
>;
