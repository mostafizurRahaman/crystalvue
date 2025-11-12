// src/app/schemas/contact-us/get-all-contact-us.ts
import { z } from "zod";

const ALLOWED_SORT_FIELDS = [
  "fullName",
  "phoneNumber",
  "email",
  "parentCategoryId",
  "serviceId",
  "status",
  "createdAt",
  "updatedAt",
] as const;

export const getAllContactUsQuerySchema = z
  .object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce
      .number()
      .int()
      .positive()
      .max(100, "Limit max 100")
      .default(10),
    sortBy: z.enum(ALLOWED_SORT_FIELDS).default("createdAt"),
    sortOrder: z.enum(["asc", "desc"]).default("desc"),
    parentCategoryId: z.string().uuid("Invalid category ID format").optional(),
    serviceId: z.string().uuid("Invalid service ID format").optional(),
    status: z.enum(["PENDING", "APPROVED", "REJECTED"]).optional(),
    search: z
      .string()
      .transform((val) => val.trim())
      .optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
  })
  .transform((data) => ({
    ...data,
    startDate: data.startDate ? new Date(data.startDate) : undefined,
    endDate: data.endDate ? new Date(data.endDate) : undefined,
  }));

export type GetAllContactUsQueryType = z.infer<
  typeof getAllContactUsQuerySchema
>;
