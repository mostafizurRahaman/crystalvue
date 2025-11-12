import { z } from "zod";

// Whitelisted sort fields
const ALLOWED_SORT_FIELDS = [
  "name",
  "email",
  "subject",
  "createdAt",
  "updatedAt",
] as const;

const ALLOWED_STATUSES = [
  "pending",
  "in-progress",
  "resolved",
  "closed",
] as const;

export const getContactUsByStatusParamsSchema = z.object({
  status: z.enum(ALLOWED_STATUSES, {
    message:
      "Invalid status. Must be pending, in-progress, resolved, or closed",
  }),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce
    .number()
    .int()
    .positive()
    .max(100, "Limit max 100")
    .default(10),
  sortBy: z.enum(ALLOWED_SORT_FIELDS).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type GetContactUsByStatusParamsType = z.infer<
  typeof getContactUsByStatusParamsSchema
>;
