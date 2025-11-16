import { z } from "zod";
import { galleryCategoryEnum } from "./create-gallery";

export const updateGallerySchema = z
  .object({
    caption: z.string().max(255, "Caption too long").optional(),
    galleryCategory: galleryCategoryEnum.nullable().optional(),
    isActive: z.boolean().optional(),
  })
  .refine(
    (data) => {
      // At least one field must be provided for update
      return Object.keys(data).length > 0;
    },
    {
      message: "At least one field must be provided for update",
    }
  );

export type UpdateGalleryType = z.infer<typeof updateGallerySchema>;
