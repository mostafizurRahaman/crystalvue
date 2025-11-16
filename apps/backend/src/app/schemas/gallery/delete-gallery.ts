import { z } from "zod";

export const deleteGalleryParamsSchema = z.object({
  id: z.string().uuid("Invalid gallery item ID"),
});

export type DeleteGalleryParamsType = z.infer<typeof deleteGalleryParamsSchema>;
