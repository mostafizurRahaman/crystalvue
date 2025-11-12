// src/app/schemas/contact-us/get-bulk-contact-for-export.ts
import { z } from "zod";

export const getBulkContactForExportQuerySchema = z
  .object({
    ids: z.array(z.string().uuid("Invalid contact ID format")).optional(),
    parentCategoryId: z.string().uuid("Invalid category ID format").optional(),
    serviceId: z.string().uuid("Invalid service ID format").optional(),
    status: z.enum(["PENDING", "APPROVED", "REJECTED"]).optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
    limit: z.coerce
      .number()
      .int()
      .positive()
      .max(1000, "Limit max 1000 for export")
      .default(100),
  })
  .transform((data) => ({
    ...data,
    startDate: data.startDate ? new Date(data.startDate) : undefined,
    endDate: data.endDate ? new Date(data.endDate) : undefined,
  }))
  .refine(
    (data) =>
      data.ids ||
      data.parentCategoryId ||
      data.serviceId ||
      data.status ||
      data.startDate ||
      data.endDate,
    {
      message: "At least one filter criteria must be provided for export",
    },
  );

export type GetBulkContactForExportQueryType = z.infer<
  typeof getBulkContactForExportQuerySchema
>;

// Helper type for contact data with relations
export type ContactWithRelations = {
  id: string;
  fullName: string;
  phoneNumber: string;
  email: string | null;
  address: string;
  images: string[];
  message: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  parentCategory: {
    id: string;
    name: string;
  } | null;
  service: {
    id: string;
    name: string;
  } | null;
};
