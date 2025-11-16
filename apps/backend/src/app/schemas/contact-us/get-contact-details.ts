// src/app/schemas/contact-us/get-contact-details.ts
import { z } from "zod";

export const getContactDetailsParamsSchema = z.object({
  id: z.string().uuid("Invalid contact ID format"),
});

export type GetContactDetailsParamsType = z.infer<
  typeof getContactDetailsParamsSchema
>;
