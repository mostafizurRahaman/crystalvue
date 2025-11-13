import axiosInstance, { ApiResponse } from "@/configs/axios";
import {
  TestimonialsResponse,
  GetAllTestimonialsRequest,
  Testimonial,
} from "@/types";

/**
 * Get all testimonials with filtering, sorting, and pagination
 */
export async function getAllTestimonials(
  params: GetAllTestimonialsRequest = {}
): Promise<TestimonialsResponse> {
  const {
    page = 1,
    limit = 10,
    search,
    rating,
    isActive,
    sortBy = "createdAt",
    sortOrder = "desc",
    from_date,
    to_date,
  } = params;

  const queryParams = new URLSearchParams();
  queryParams.append("page", page.toString());
  queryParams.append("limit", limit.toString());
  queryParams.append("sortBy", sortBy);
  queryParams.append("sortOrder", sortOrder);

  if (search) queryParams.append("search", search);
  if (rating !== undefined) queryParams.append("rating", rating.toString());
  if (isActive !== undefined)
    queryParams.append("isActive", isActive.toString());
  if (from_date) queryParams.append("from_date", from_date);
  if (to_date) queryParams.append("to_date", to_date);

  const response = await axiosInstance.get<TestimonialsResponse>(
    `/testimonials?${queryParams.toString()}`
  );
  console.log(response.data);
  return response.data;
}

/**
 * Get testimonials by IDs for bulk operations (if needed in the future)
 */
export async function getTestimonialsByIds(
  ids: string[]
): Promise<Testimonial[]> {
  // Note: Since there's no bulk export endpoint for testimonials in the backend,
  // this would be implemented if needed in the future
  console.warn("Bulk export for testimonials is not supported yet");
  return [];
}
