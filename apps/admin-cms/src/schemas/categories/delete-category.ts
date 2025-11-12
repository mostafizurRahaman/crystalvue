import { z } from "zod";

export const deleteCategoryParamsSchema = z.object({
  id: z.string().uuid("Invalid category ID format"),
});

export type DeleteCategoryParamsType = z.infer<
  typeof deleteCategoryParamsSchema
>;
