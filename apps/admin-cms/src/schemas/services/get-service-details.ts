import { z } from "zod";

export const getServiceDetailsParamsSchema = z.object({
  id: z.string().uuid("Invalid service ID format"),
});

export type GetServiceDetailsParamsType = z.infer<
  typeof getServiceDetailsParamsSchema
>;
