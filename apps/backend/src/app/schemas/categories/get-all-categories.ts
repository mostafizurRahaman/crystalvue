// src/app/schemas/categories/get-all-categories.ts
import { z } from "zod";

// Whitelisted sort fields
const ALLOWED_SORT_FIELDS = [
  "name",
  "sortOrder",
  "createdAt",
  "updatedAt",
  "isPremium",
  "isActive",
] as const;

export const getAllCategoriesQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce
    .number()
    .int()
    .positive()
    .max(100, "Limit max 100")
    .default(10),
  sortBy: z.enum(ALLOWED_SORT_FIELDS).default("sortOrder"),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
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
  isRepairingService: z
    .string()
    .transform((val) => val === "true")
    .pipe(z.boolean())
    .optional(),
  isShowHome: z
    .string()
    .transform((val) => val === "true")
    .pipe(z.boolean())
    .optional(),
  search: z
    .string()
    .transform((val) => val.trim())
    .optional(),
  userId: z.string().uuid("Invalid user ID format").optional(),
  from_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format. Use YYYY-MM-DD").optional(),
  to_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format. Use YYYY-MM-DD").optional(),
});

export type GetAllCategoriesQueryType = z.infer<
  typeof getAllCategoriesQuerySchema
>;
