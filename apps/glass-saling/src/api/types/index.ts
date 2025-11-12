export * from "./slider.types";
export * from "./category.types";
export * from "./service.types";
export * from "./testimonial.types";
export * from "./contact.types";
export * from "./gallery.types";

// Common pagination and sorting types
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface SortParams {
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
