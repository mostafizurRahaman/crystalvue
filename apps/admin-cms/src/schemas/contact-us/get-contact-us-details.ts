import { z } from "zod";

export const getContactUsDetailsParamsSchema = z.object({
  id: z.string().uuid("Invalid contact inquiry ID format"),
});

export type GetContactUsDetailsParamsType = z.infer<typeof getContactUsDetailsParamsSchema>;
