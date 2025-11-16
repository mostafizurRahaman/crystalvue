import { z } from "zod";

export const getCategoryDetailsParamsSchema = z.object({
  id: z.string().uuid("Invalid category ID format"),
});

export const getCategoryDetailsQuerySchema = z.object({
  includeInactive: z.coerce.boolean().optional(),
});

export type GetCategoryDetailsParamsType = z.infer<
  typeof getCategoryDetailsParamsSchema
>;
export type GetCategoryDetailsQueryType = z.infer<
  typeof getCategoryDetailsQuerySchema
>;
