// src/app/schemas/contact-us/get-bulk-contact-for-export.ts
import { z } from "zod";

export const getBulkContactForExportQuerySchema = z.object({
  ids: z
    .string()
    .min(1, "At least one contact ID must be provided for export")
    .transform((val) => val.split(",").map((id) => id.trim()))
    .pipe(
      z
        .array(z.string().uuid("Invalid contact ID format"))
        .min(1, "At least one contact ID must be provided for export")
    ),
});

export type GetBulkContactUsForExportQueryType = z.infer<
  typeof getBulkContactForExportQuerySchema
>;

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
