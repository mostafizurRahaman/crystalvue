import { z } from "zod";

// No body validation needed for get-access-token as refresh token comes from cookies
export const getAccessTokenSchema = z.object({}).strict();

export type GetAccessTokenType = z.infer<typeof getAccessTokenSchema>;
