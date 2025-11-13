import { z } from "zod";

export const getAllTestimonialsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  search: z
    .string()
    .transform((val) => val.trim())
    .optional(),
  rating: z.coerce.number().int().min(1).max(5).optional(),
  isActive: z
    .string()
    .transform((val) => val === "true")
    .pipe(z.boolean())
    .optional(),
  sortBy: z.enum(["createdAt", "name", "rating"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
  from_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format. Use YYYY-MM-DD").optional(),
  to_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format. Use YYYY-MM-DD").optional(),
});

export type GetAllTestimonialsQueryType = z.infer<typeof getAllTestimonialsQuerySchema>;
