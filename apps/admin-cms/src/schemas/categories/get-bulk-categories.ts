import { z } from "zod";

export const getBulkCategoriesQuerySchema = z.object({
  ids: z
    .string()
    .transform((value) =>
      value
        .split(",")
        .map((id) => id.trim())
        .filter(Boolean)
    )
    .optional(),
  isActive: z.coerce.boolean().optional(),
  isPremium: z.coerce.boolean().optional(),
  isRepairingService: z.coerce.boolean().optional(),
  isShowHome: z.coerce.boolean().optional(),
});

export type GetBulkCategoriesQueryType = z.infer<
  typeof getBulkCategoriesQuerySchema
>;
