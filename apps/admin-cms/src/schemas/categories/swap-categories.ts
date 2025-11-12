import { z } from "zod";

export const swapCategoriesSchema = z.object({
  categoryId1: z.string().uuid("Invalid first category ID"),
  categoryId2: z.string().uuid("Invalid second category ID"),
});

export type SwapCategoriesType = z.infer<typeof swapCategoriesSchema>;
