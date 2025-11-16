// src/app/schemas/contact-us/update-contact-status.ts
import { z } from "zod";

export const updateContactStatusParamsSchema = z.object({
  id: z.string().uuid("Invalid contact ID format"),
});

export const updateContactStatusSchema = z
  .object({
    status: z.enum(["PENDING", "APPROVED", "REJECTED"]),
    reason: z
      .string()
      .min(1, "Reason is required for status change")
      .max(500, "Reason too long (max 500 characters)")
      .optional()
      .transform((val) => val?.trim()),

    adminNotes: z
      .string()
      .min(1, "Admin notes minimum 1 character")
      .max(1000, "Admin notes too long (max 1000 characters)")
      .optional()
      .transform((val) => val?.trim()),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  })
  .superRefine((data, ctx) => {
    if (data.status === "REJECTED" && !data.reason) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["reason"],
        message: "Reason is required when status is REJECTED",
      });
    }
  });

export type UpdateContactStatusParamsType = z.infer<
  typeof updateContactStatusParamsSchema
>;
export type UpdateContactStatusType = z.infer<typeof updateContactStatusSchema>;
