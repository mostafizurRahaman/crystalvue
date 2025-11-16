import { z } from "zod";
import { ImageSchema, PaginationParams, SortParams } from "./slider.types";

export const TestimonialSchema = z.object({
  id: z.string(),
  name: z.string(),
  message: z.string(),
  rating: z.number().default(5),
  position: z.string().optional(),
  company: z.string().optional(),
  isActive: z.boolean().default(true),
  createdAt: z.string(),
  updatedAt: z.string(),
  image: ImageSchema.optional(),
});

export type Testimonial = z.infer<typeof TestimonialSchema>;

export const GetAllTestimonialsResponseSchema = z.object({
  status: z.number(),
  success: z.boolean(),
  message: z.string(),
  data: z.array(TestimonialSchema),
  pagination: z.object({
    limit: z.number(),
    page: z.number(),
    total_pages: z.number(),
    total_items: z.number(),
  }).optional(),
});

export type GetAllTestimonialsResponse = z.infer<typeof GetAllTestimonialsResponseSchema>;

// Helper functions
export const getTestimonialAvatar = (testimonial: Testimonial): string | null => {
  return testimonial.image?.url || null;
};

// Extended params for testimonials
export interface GetAllTestimonialsParams extends PaginationParams, SortParams {
  isActive?: boolean;
  rating?: number;
  search?: string;
}
