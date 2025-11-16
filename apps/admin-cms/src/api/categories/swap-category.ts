import axiosInstance from "@/configs/axios";
import { ApiResponse } from "@/configs/axios";
import { SwapCategoriesRequest } from "@/types/category";

/**
 * Swap the sort order of two categories
 */
export async function swapCategories(
  data: SwapCategoriesRequest
): Promise<ApiResponse<null>> {
  const response = await axiosInstance.post<ApiResponse<null>>(
    "/categories/swap",
    data
  );
  return response.data;
}
