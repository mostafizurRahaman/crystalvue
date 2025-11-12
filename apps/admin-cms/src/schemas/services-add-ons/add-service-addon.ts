import { z } from "zod";

export const addServiceAddonSchema = z.object({
  addonText: z
    .string()
    .min(1, "Addon text is required")
    .max(255, "Addon text too long (max 255 chars)")
    .transform((val) => val.trim()),
  sortOrder: z
    .number()
    .int("Sort order must be integer")
    .min(0, "Sort order must be 0 or greater")
    .optional(),
  isActive: z.boolean().optional().default(true),
});

export type AddServiceAddonSchemaType = z.infer<typeof addServiceAddonSchema>;
