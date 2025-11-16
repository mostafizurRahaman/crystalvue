import { z } from "zod";

export const deleteContactUsParamsSchema = z.object({
  id: z.string().uuid("Invalid contact inquiry ID format"),
});

export type DeleteContactUsParamsType = z.infer<typeof deleteContactUsParamsSchema>;
