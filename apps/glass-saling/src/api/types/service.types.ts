import { z } from "zod";
import { CategorySchema } from "./category.types";
import { ImageSchema, PaginationParams, SortParams } from "./slider.types";

export const ServiceAddonSchema = z.object({
  id: z.string(),
  serviceId: z.string(),
  addonText: z.string(),
  sortOrder: z.number(),
  isActive: z.boolean(),
  createdAt: z.string(),
});

export type ServiceAddon = z.infer<typeof ServiceAddonSchema>;

export const ServiceSchema = z.object({
  id: z.string(),
  parentCategoryId: z.string(),
  name: z.string(),
  tagline: z.string(),
  description: z.string().optional(),
  price: z.number().optional(),
  isPremium: z.boolean().default(false),
  isActive: z.boolean().default(true),
  createdAt: z.string(),
  updatedAt: z.string(),
  image: ImageSchema.optional(),
  parentCategory: z.object({
    id: z.string(),
    name: z.string(),
    isActive: z.boolean(),
  }).optional(),
  serviceAddons: z.array(ServiceAddonSchema).optional(),
  _count: z.object({
    serviceAddons: z.number(),
  }).optional(),
});

export type Service = z.infer<typeof ServiceSchema>;

export const GetAllServicesResponseSchema = z.object({
  status: z.number(),
  success: z.boolean(),
  message: z.string(),
  data: z.array(ServiceSchema),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total_items: z.number(),
    total_pages: z.number(),
  }).optional(),
});

export type GetAllServicesResponse = z.infer<typeof GetAllServicesResponseSchema>;

export const GetAllServicesByCategoriesResponseSchema = z.object({
  status: z.number(),
  success: z.boolean(),
  message: z.string(),
  data: z.object({
    category: CategorySchema,
    services: z.array(ServiceSchema),
  }),
});

export type GetAllServicesByCategoriesResponse = z.infer<typeof GetAllServicesByCategoriesResponseSchema>;

// Extended params for services
export interface GetAllServicesParams extends PaginationParams, SortParams {
  categoryId?: string;
  isActive?: boolean;
  isPremium?: boolean;
  search?: string;
}

export interface GetAllServicesByCategoriesParams extends PaginationParams, SortParams {
  categoryId?: string;
  isActive?: boolean;
  featured?: boolean;
}
