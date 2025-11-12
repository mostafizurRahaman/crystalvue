// src/app/schemas/services/get-all-services.ts
import { z } from "zod";

// Whitelisted sort fields
const ALLOWED_SORT_FIELDS = [
  "name",
  "sortOrder",
  "createdAt",
  "updatedAt",
  "isPremium",
  "isActive",
  "price",
] as const;

export const getAllServicesQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce
    .number()
    .int()
    .positive()
    .max(100, "Limit max 100")
    .default(10),
  sortBy: z.enum(ALLOWED_SORT_FIELDS).default("sortOrder"),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
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
  search: z
    .string()
    .transform((val) => val.trim())
    .optional(),
});

export type GetAllServicesQueryType = z.infer<typeof getAllServicesQuerySchema>;
