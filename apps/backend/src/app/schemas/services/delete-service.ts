// src/app/schemas/services/delete-service.ts
import { z } from "zod";

export const deleteServiceParamsSchema = z.object({
  id: z.string().uuid("Invalid service ID format"),
});

export type DeleteServiceParamsType = z.infer<typeof deleteServiceParamsSchema>;
