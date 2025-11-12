import { z } from "zod";

export const getAllTestimonialsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  search: z.string().optional(),
  rating: z.coerce.number().int().min(1).max(5).optional(),
  isActive: z.boolean().optional(),
  sortBy: z.enum(["createdAt", "name", "rating"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type GetAllTestimonialsQueryType = z.infer<
  typeof getAllTestimonialsQuerySchema
>;
