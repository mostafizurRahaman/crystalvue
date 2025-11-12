// src/app/schemas/contact-us/get-contact-by-status.ts
import { z } from "zod";

export const getContactByStatusQuerySchema = z
  .object({
    status: z.enum(["PENDING", "APPROVED", "REJECTED"]),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce
      .number()
      .int()
      .positive()
      .max(100, "Limit max 100")
      .default(10),
    sortBy: z.enum(["createdAt", "updatedAt", "fullName"]).default("createdAt"),
    sortOrder: z.enum(["asc", "desc"]).default("desc"),
  })
  .transform((data) => ({
    ...data,
    page: data.page || 1,
    limit: data.limit || 10,
  }));

export type GetContactByStatusQueryType = z.infer<
  typeof getContactByStatusQuerySchema
>;
