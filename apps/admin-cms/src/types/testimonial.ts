// TypeScript types for Testimonial entity
export interface ImageMetadata {
  id?: string;
  url: string;
  publicId?: string;
  folder?: string;
  altText?: string;
  width?: number;
  height?: number;
  format?: string;
  size?: number;
}

export interface Testimonial {
  id: string;
  name: string;
  message: string;
  rating: number;
  position?: string;
  company?: string;
  image?: ImageMetadata;
  imageId?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Flattened type for export (only primitive types)
export type TestimonialExportData = {
  id: string;
  name: string;
  message: string;
  rating: number;
  position: string | null;
  company: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  pagination?: {
    page: number;
    limit: number;
    total_items: number;
    total_pages: number;
  };
}

export interface TestimonialsResponse {
  success: boolean;
  message: string;
  data: Testimonial[];
  pagination: {
    page: number;
    limit: number;
    total_items: number;
    total_pages: number;
  };
}

export interface TestimonialsForExportResponse {
  success: boolean;
  message: string;
  data: Testimonial[];
  summary: {
    total: number;
    exportedAt: string;
  };
}

export interface TestimonialResponse {
  success: boolean;
  message: string;
  data: Testimonial;
}

// Request types
export interface CreateTestimonialRequest {
  name: string;
  message: string;
  rating?: number;
  position?: string;
  company?: string;
  image?: ImageMetadata;
  isActive?: boolean;
}

export interface UpdateTestimonialRequest {
  name?: string;
  message?: string;
  rating?: number;
  position?: string;
  company?: string;
  image?: ImageMetadata;
  isActive?: boolean;
}

export interface GetAllTestimonialsRequest {
  page?: number;
  limit?: number;
  search?: string;
  rating?: number;
  isActive?: boolean;
  sortBy?: "createdAt" | "name" | "rating";
  sortOrder?: "asc" | "desc";
  from_date?: string;
  to_date?: string;
}

export interface GetBulkTestimonialsRequest {
  ids?: string; // Comma-separated string for API
  search?: string;
  rating?: number;
  isActive?: boolean;
  limit?: number;
}

export interface GetBulkTestimonialsByIdsRequest {
  ids: string[]; // Array for frontend convenience
  search?: string;
  rating?: number;
  isActive?: boolean;
}

export interface GetTestimonialDetailsRequest {
  includeInactive?: boolean;
}

export interface GetBulkTestimonialsRequest {
  search?: string;
  rating?: number;
  isActive?: boolean;
  limit?: number;
}

export interface UpdateTestimonialParams {
  id: string;
}

export interface DeleteTestimonialRequest {
  id: string;
}

export interface DeleteTestimonialResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    name: string;
    deletedImagesCount: number;
    cloudinaryDeletions: Array<{
      type: string;
      result: {
        public_id: string;
        secure_url: string;
      };
    }>;
  };
}
