import axiosInstance from "@/configs/axios";
import { UpdateCategoryRequest, CategoryResponse } from "@/types/category";

/**
 * Update an existing category
 */
export async function updateCategory(
  id: string,
  data: UpdateCategoryRequest
): Promise<CategoryResponse> {
  const response = await axiosInstance.put<CategoryResponse>(
    `/categories/${id}`,
    data
  );
  return response.data;
}
