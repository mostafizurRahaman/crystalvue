import * as z from "zod";
import { imageMetadataSchema } from "./create-slider";

// Update schema for hero slider (all fields optional)
export const updateHeroSliderSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(255, "Title too long (max 255 chars)")
    .optional(),
  subtitle: z.string().max(255, "Subtitle too long (max 255 chars)"),
  buttonText: z
    .string()
    .max(100, "Button text too long (max 100 chars)")
    .optional(),
  buttonUrl: z
    .string()
    .max(255, "Button URL too long (max 255 chars)") // path only
    .optional(),
  image: imageMetadataSchema,
  isActive: z.boolean().default(true),
  orderNumber: z
    .number()
    .int("Order number must be integer")
    .min(1, "Order number must be positive")
    .optional(),
});

export type updateHeroSliderType = (typeof updateHeroSliderSchema)["_output"];
