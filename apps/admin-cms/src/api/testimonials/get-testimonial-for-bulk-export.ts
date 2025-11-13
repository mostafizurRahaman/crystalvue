import axiosInstance, { ApiResponse } from "@/configs/axios";
import { TestimonialsResponse, GetBulkTestimonialsRequest, GetBulkTestimonialsByIdsRequest, Testimonial } from "@/types";

/**
 * Get testimonials for bulk export by comma-separated IDs
 * Uses the new backend endpoint: /testimonials/bulk/export
 */
export async function getTestimonialsForBulkExport(
  params: GetBulkTestimonialsRequest = {}
): Promise<TestimonialsResponse> {
  const {
    ids, // Now expects comma-separated string like "id1,id2,id3"
    search,
    rating,
    isActive = true, // Default to active testimonials for export
  } = params;

  if (!ids || ids.trim() === "") {
    throw new Error("Testimonial IDs are required for bulk export");
  }

  const queryParams = new URLSearchParams();
  queryParams.append("ids", ids.trim());
  
  if (search) queryParams.append("search", search.trim());
  if (rating !== undefined) queryParams.append("rating", rating.toString());
  if (isActive !== undefined)
    queryParams.append("isActive", isActive.toString());

  try {
    const response = await axiosInstance.get<TestimonialsResponse>(
      `/testimonials/bulk/export?${queryParams.toString()}`
    );

    return response.data;
  } catch (error) {
    console.error("Failed to fetch testimonials for bulk export:", error);
    throw new Error("Failed to fetch testimonials for bulk export");
  }
}

/**
 * Helper function to convert array of IDs to comma-separated string
 * This is a convenience function for frontend usage
 */
export function convertIdsToCommaString(ids: string[]): string {
  if (!Array.isArray(ids) || ids.length === 0) {
    return "";
  }
  return ids.filter(id => id && id.trim()).join(",");
}

/**
 * Get testimonials for bulk export by array of IDs
 * This is the recommended function to use from frontend components
 */
export async function getTestimonialsForBulkExportByIds(
  ids: string[],
  options: Omit<GetBulkTestimonialsByIdsRequest, 'ids'> = {}
): Promise<TestimonialsResponse> {
  const idsString = convertIdsToCommaString(ids);
  return getTestimonialsForBulkExport({
    ...options,
    ids: idsString,
  });
}
