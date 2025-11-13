import axiosInstance from "@/configs/axios";
import { ApiResponse } from "@/configs/axios";
import { DeleteCategoryResponse } from "@/types/category";

/**
 * Delete a category by ID
 */
export async function deleteCategory(
  id: string
): Promise<DeleteCategoryResponse> {
  const url = `/categories/${id}`;
  const response = await axiosInstance.delete<DeleteCategoryResponse>(url);
  return response.data;
}
