import axiosInstance from "@/configs/axios";
import { ApiResponse } from "@/configs/axios";
import {
  Category,
  GetAllCategoriesRequest,
  CategoriesResponse,
} from "@/types/category";

/**
 * Get all categories with filtering, sorting, and pagination
 */
export async function getAllCategories(
  params: GetAllCategoriesRequest = {}
): Promise<CategoriesResponse> {
  const {
    page = 1,
    limit = 10,
    sortBy = "sortOrder",
    sortOrder = "asc",
    isActive,
    isPremium,
    isRepairingService,
    isShowHome,
    search,
    userId,
    from_date,
    to_date,
  } = params;

  const queryParams = new URLSearchParams();
  queryParams.append("page", page.toString());
  queryParams.append("limit", limit.toString());
  queryParams.append("sortBy", sortBy);
  queryParams.append("sortOrder", sortOrder);

  if (isActive !== undefined)
    queryParams.append("isActive", isActive.toString());
  if (isPremium !== undefined)
    queryParams.append("isPremium", isPremium.toString());
  if (isRepairingService !== undefined)
    queryParams.append("isRepairingService", isRepairingService.toString());
  if (isShowHome !== undefined)
    queryParams.append("isShowHome", isShowHome.toString());
  if (search) queryParams.append("search", search);
  if (userId) queryParams.append("userId", userId);
  if (from_date) queryParams.append("from_date", from_date);
  if (to_date) queryParams.append("to_date", to_date);

  const response = await axiosInstance.get<CategoriesResponse>(
    `/categories?${queryParams.toString()}`
  );
  return response.data;
}

/**
 * Get categories by IDs for bulk operations
 */
export async function getCategoriesByIds(ids: string[]): Promise<Category[]> {
  if (ids.length === 0) return [];

  const queryParams = new URLSearchParams();
  ids.forEach((id) => queryParams.append("ids", id));

  const response = await axiosInstance.get<ApiResponse<Category[]>>(
    `/categories/export?${queryParams.toString()}`
  );
  return response.data.data || [];
}
