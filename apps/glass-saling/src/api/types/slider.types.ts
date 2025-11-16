import { z } from "zod";

export const ImageSchema = z.object({
  id: z.string(),
  url: z.string(),
  altText: z.string().optional(),
  publicId: z.string().optional(),
  folder: z.string().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  format: z.string().optional(),
  size: z.number().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type Image = z.infer<typeof ImageSchema>;

export const SliderSchema = z.object({
  id: z.number(),
  title: z.string(),
  subtitle: z.string().optional(),
  buttonText: z.string().optional(),
  buttonUrl: z.string().optional(),
  isActive: z.boolean().default(true),
  orderNumber: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
  userId: z.string().optional(),
  modifiedBy: z.string().optional(),
  image: ImageSchema.optional(),
  createdByUser: z
    .object({
      id: z.string(),
      name: z.string(),
      email: z.string(),
    })
    .optional(),
  modifiedByUser: z
    .object({
      id: z.string(),
      name: z.string(),
      email: z.string(),
    })
    .optional(),
});

export type Slider = z.infer<typeof SliderSchema>;

// Helper function to extract image URL
export const getImageUrl = (image: Image | null | undefined): string => {
  if (!image) return "";
  return image.url;
};

export const getButtonUrl = (slider: Slider): string => {
  return slider.buttonUrl || "/contact-us";
};

export type GetAllSlidersResponse = z.infer<typeof GetAllSlidersResponseSchema>;

// Pagination and sorting types
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface SortParams {
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface GetAllSlidersParams extends PaginationParams, SortParams {
  active_only?: boolean;
  from_date?: string;
  to_date?: string;
  search?: string;
}

export const GetAllSlidersResponseSchema = z.object({
  status: z.number(),
  success: z.boolean(),
  message: z.string(),
  data: z.array(SliderSchema),
  pagination: z
    .object({
      page: z.number(),
      limit: z.number(),
      total_pages: z.number(),
      total_items: z.number(),
    })
    .optional(),
});

// Pagination and sorting types
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface SortParams {
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface GetAllSlidersParams extends PaginationParams, SortParams {
  active_only?: boolean;
  from_date?: string;
  to_date?: string;
  search?: string;
}
