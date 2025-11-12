import axiosInstance from "@/configs/axios";
import { GetAllServicesResponse, GetAllServicesParams } from "./types";

/**
 * Get all services with pagination, filtering, and sorting
 * Matches the backend API structure at /services
 */
export const getAllServices = async (
  params?: GetAllServicesParams
): Promise<GetAllServicesResponse> => {
  const searchParams = new URLSearchParams();

  if (params) {
    if (params.page) searchParams.append("page", params.page.toString());
    if (params.limit) searchParams.append("limit", params.limit.toString());
    if (params.sortBy) searchParams.append("sortBy", params.sortBy);
    if (params.sortOrder) searchParams.append("sortOrder", params.sortOrder);
    if (params.categoryId) searchParams.append("categoryId", params.categoryId);
    if (params.isActive !== undefined)
      searchParams.append("isActive", params.isActive.toString());
    if (params.isPremium !== undefined)
      searchParams.append("isPremium", params.isPremium.toString());
    if (params.search) searchParams.append("search", params.search);
  }

  const url = searchParams.toString()
    ? `/services?${searchParams.toString()}`
    : "/services";

  console.log('Making request to:', url);
  const response = await axiosInstance.get<GetAllServicesResponse>(url);
  console.log('Services API response:', response.data);
  return response.data;
};
