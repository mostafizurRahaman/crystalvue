// src/app/schemas/services/get-bulk-services-for-export.ts
import { z } from "zod";

export const getBulkServicesQuerySchema = z
  .object({
    ids: z.string({ error: "Service IDs are required" }).transform((val) =>
      val
        .split(",")
        .map((id) => id.trim())
        .filter(Boolean)
    ),
    categoryId: z.string().uuid("Invalid category ID format").optional(),
    isActive: z
      .string()
      .transform((val) => val === "true")
      .pipe(z.boolean())
      .optional(),
    isPremium: z
      .string()
      .transform((val) => val === "true")
      .pipe(z.boolean())
      .optional(),
    limit: z.coerce
      .number()
      .int()
      .positive()
      .max(1000, "Limit max 1000 for export")
      .default(100),
  })
  .refine((data) => data.ids || data.categoryId, {
    message: "Either 'ids' or 'categoryId' must be provided for export",
  });

export type GetBulkServicesQueryType = z.infer<
  typeof getBulkServicesQuerySchema
>;
