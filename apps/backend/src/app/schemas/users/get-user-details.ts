import { z } from "zod";

export const getUserDetailsParamsSchema = z.object({
  id: z.string().uuid("Invalid user ID format"),
});

export type GetUserDetailsParamsType = z.infer<
  typeof getUserDetailsParamsSchema
>;
