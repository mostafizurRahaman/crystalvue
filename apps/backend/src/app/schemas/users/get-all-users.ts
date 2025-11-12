import { z } from "zod";

export const getAllUsersQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
  role: z.enum(["user", "admin", "superadmin"]).optional(),
  userStatus: z.enum(["active", "pending", "blocked"]).optional(),
  sortBy: z.enum(["createdAt", "name", "email"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type GetAllUsersQueryType = z.infer<typeof getAllUsersQuerySchema>;
