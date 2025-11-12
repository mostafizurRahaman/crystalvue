import axiosInstance from "@/configs/axios";
import { ServicesResponse, GetAllServicesRequest, Service } from "@/types";

/**
 * Get all services with filtering, sorting, and pagination
 */
export async function getAllServices(
  params: GetAllServicesRequest = {}
): Promise<ServicesResponse> {
  const {
    page = 1,
    limit = 10,
    sortBy = "sortOrder",
    sortOrder = "asc",
    categoryId,
    isActive,
    isPremium,
    search,
    from_date,
    to_date,
  } = params;

  const queryParams = new URLSearchParams();
  queryParams.append("page", page.toString());
  queryParams.append("limit", limit.toString());
  queryParams.append("sortBy", sortBy);
  queryParams.append("sortOrder", sortOrder);

  if (categoryId) queryParams.append("categoryId", categoryId);
  if (isActive !== undefined)
    queryParams.append("isActive", isActive.toString());
  if (isPremium !== undefined)
    queryParams.append("isPremium", isPremium.toString());
  if (search) queryParams.append("search", search);
  if (from_date) queryParams.append("from_date", from_date);
  if (to_date) queryParams.append("to_date", to_date);

  const response = await axiosInstance.get<ServicesResponse>(
    `/services?${queryParams.toString()}`
  );
  return response.data;
}

/**
 * Get services by IDs for bulk operations
 */
export async function getServicesByIds(ids: string[]): Promise<Service[]> {
  if (ids.length === 0) return [];

  const queryParams = new URLSearchParams();
  ids.forEach((id) => queryParams.append("ids", id));

  const response = await axiosInstance.get<Service[]>(
    `/services/export?${queryParams.toString()}`
  );
  return response.data || [];
}
