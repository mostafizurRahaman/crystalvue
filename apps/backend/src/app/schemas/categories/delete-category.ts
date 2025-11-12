// src/app/schemas/categories/delete-category.ts
import { z } from "zod";

export const deleteCategoryParamsSchema = z.object({
  id: z.string().uuid("Invalid category ID format"),
});

export const deleteCategoryQuerySchema = z.object({
  softDelete: z.coerce.boolean().optional(),
});

export type DeleteCategoryParamsType = z.infer<
  typeof deleteCategoryParamsSchema
>;
export type DeleteCategoryQueryType = z.infer<typeof deleteCategoryQuerySchema>;
