import axiosInstance from "@/configs/axios";
import { GetCategoryDetailsRequest, CategoryResponse } from "@/types/category";

/**
 * Get single category details by ID
 */
export async function getCategoryDetails(
  id: string,
  params: GetCategoryDetailsRequest = {}
): Promise<CategoryResponse> {
  const queryParams = new URLSearchParams();
  if (params.includeInactive !== undefined) {
    queryParams.append("includeInactive", params.includeInactive.toString());
  }

  const url = `/categories/${id}${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
  const response = await axiosInstance.get<CategoryResponse>(url);
  return response.data;
}
