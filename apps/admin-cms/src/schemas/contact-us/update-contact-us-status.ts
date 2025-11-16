import { z } from "zod";

export const updateContactUsStatusParamsSchema = z.object({
  id: z.string().uuid("Invalid contact inquiry ID format"),
});

export const updateContactUsStatusBodySchema = z.object({
  status: z.enum(["pending", "in-progress", "resolved", "closed"], {
    message:
      "Invalid status. Must be pending, in-progress, resolved, or closed",
  }),
});

export type UpdateContactUsStatusParamsType = z.infer<
  typeof updateContactUsStatusParamsSchema
>;
export type UpdateContactUsStatusBodyType = z.infer<
  typeof updateContactUsStatusBodySchema
>;
