import { z } from "zod";

// Whitelisted sort fields
const ALLOWED_SORT_FIELDS = [
  "name",
  "email",
  "subject",
  "status",
  "createdAt",
  "updatedAt",
] as const;

const ALLOWED_STATUSES = [
  "pending",
  "in-progress",
  "resolved",
  "closed",
] as const;

export const getAllContactUsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce
    .number()
    .int()
    .positive()
    .max(100, "Limit max 100")
    .default(10),
  sortBy: z.enum(ALLOWED_SORT_FIELDS).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
  from_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format. Use YYYY-MM-DD").optional(),
  to_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format. Use YYYY-MM-DD").optional(),
  status: z.enum(ALLOWED_STATUSES).optional(),
});

export type GetAllContactUsQueryType = z.infer<typeof getAllContactUsQuerySchema>;
