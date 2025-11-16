import { z } from "zod";
import { ImageSchema, PaginationParams, SortParams } from "./slider.types";

export const CategoryAddonSchema = z.object({
  id: z.string(),
  parentCategoryId: z.string(),
  addonText: z.string(),
  sortOrder: z.number(),
  isActive: z.boolean(),
  createdAt: z.string(),
});

export type CategoryAddon = z.infer<typeof CategoryAddonSchema>;

export const CategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  tagline: z.string().optional(),
  description: z.string().optional(),
  isPremium: z.boolean().default(false),
  isRepairingService: z.boolean().default(false),
  isActive: z.boolean().default(true),
  sortOrder: z.number().default(0),
  isShowHome: z.boolean().default(false),
  createdAt: z.string(),
  updatedAt: z.string(),
  userId: z.string().optional(),
  cardImage: ImageSchema.optional(),
  detailsImage: ImageSchema.optional(),
  createdBy: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    profileUrl: z.string().optional(),
  }).optional(),
  categoryAddons: z.array(CategoryAddonSchema).optional(),
  services: z.array(z.any()).optional(),
  _count: z.object({
    services: z.number(),
    categoryAddons: z.number(),
  }).optional(),
});

export type Category = z.infer<typeof CategorySchema>;

export const GetAllCategoriesResponseSchema = z.object({
  status: z.number(),
  success: z.boolean(),
  message: z.string(),
  data: z.array(CategorySchema),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total_items: z.number(),
    total_pages: z.number(),
  }).optional(),
});

export type GetAllCategoriesResponse = z.infer<typeof GetAllCategoriesResponseSchema>;

// Extended params for categories
export interface GetAllCategoriesParams extends PaginationParams, SortParams {
  isActive?: boolean;
  isPremium?: boolean;
  isRepairingService?: boolean;
  isShowHome?: boolean;
  search?: string;
  userId?: string;
  from_date?: string;
  to_date?: string;
}
