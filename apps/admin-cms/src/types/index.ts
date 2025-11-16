// Export shared types first (to avoid ambiguity)
export type { ImageMetadata, ApiResponse } from "./shared";

// Export unique types from each module
export type {
  Category,
  CategoryAddon,
  CategoryExportData,
  CategoriesResponse,
  CategoriesForExportResponse,
  CategoryResponse,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  GetAllCategoriesRequest,
  GetCategoryDetailsRequest,
  SwapCategoriesRequest,
  GetBulkCategoriesRequest,
  DeleteCategoryResponse,
  // Export Service and ServiceAddon from category (used together with categories)
  Service,
  ServiceAddon,
  User as CategoryUser,
} from "./category";

export type {
  Service as ServiceType,
  ServiceAddon as ServiceAddonType,
  ServiceExportData,
  ServicesResponse,
  ServicesForExportResponse,
  ServiceResponse,
  CreateServiceRequest,
  UpdateServiceRequest,
  GetAllServicesRequest,
  GetServiceDetailsRequest,
  GetBulkServicesRequest,
  AddServiceAddonRequest,
  RemoveServiceAddonRequest,
  DeleteServiceResponse,
} from "./service";

export type {
  Testimonial,
  TestimonialExportData,
  TestimonialsResponse,
  TestimonialsForExportResponse,
  TestimonialResponse,
  CreateTestimonialRequest,
  UpdateTestimonialRequest,
  GetAllTestimonialsRequest,
  GetBulkTestimonialsRequest,
  GetBulkTestimonialsByIdsRequest,
  GetTestimonialDetailsRequest,
  UpdateTestimonialParams,
  DeleteTestimonialRequest,
  DeleteTestimonialResponse,
} from "./testimonial";

export type {
  Gallery,
  GalleryCategory,
  GalleryExportData,
  GalleriesResponse,
  GalleryResponse,
  GalleryBulkExportResponse,
  CreateGalleryRequest,
  UpdateGalleryRequest,
  GetAllGalleriesRequest,
  GetGalleryDetailsRequest,
  DeleteGalleryResponse,
  GetGalleriesForBulkExportRequest,
} from "./gallery";

export * from "./user";
export * from "../api/contact-us/types";
