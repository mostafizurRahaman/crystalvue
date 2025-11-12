import { z } from "zod";

export const getGalleryDetailsParamsSchema = z.object({
  id: z.string().uuid("Invalid gallery item ID"),
});

export type GetGalleryDetailsParamsType = z.infer<
  typeof getGalleryDetailsParamsSchema
>;
