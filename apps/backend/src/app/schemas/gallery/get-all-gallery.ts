import { z } from "zod";
import { galleryCategoryEnum } from "./create-gallery";

export const getAllGalleryQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
  galleryCategory: galleryCategoryEnum.optional(),
  search: z.string().optional(),
  isActive: z.boolean().optional(),
  sortBy: z.enum(["createdAt", "caption"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type GetAllGalleryQueryType = z.infer<typeof getAllGalleryQuerySchema>;
