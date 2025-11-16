// src/app/schemas/category-add-ons/create-category-add-on.ts
import { z } from "zod";

export const createCategoryAddOnParamsSchema = z.object({
  id: z.string().uuid("Invalid category ID format"),
});

export const createCategoryAddOnBodySchema = z.object({
  addons: z
    .array(z.string().min(1, "Addon text cannot be empty"))
    .min(1, "At least one add-on is required"),
});

export type CreateCategoryAddOnParamsType = z.infer<
  typeof createCategoryAddOnParamsSchema
>;
export type CreateCategoryAddOnBodyType = z.infer<
  typeof createCategoryAddOnBodySchema
>;
