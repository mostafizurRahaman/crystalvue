import { z } from "zod";

// Schema for URL parameters
export const deleteUserParamsSchema = z.object({
  id: z.string().uuid("Invalid user ID format"),
});

export type DeleteUserParamsType = z.infer<typeof deleteUserParamsSchema>;
