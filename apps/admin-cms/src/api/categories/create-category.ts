import axiosInstance from "@/configs/axios";
import { CreateCategoryRequest, CategoryResponse } from "@/types/category";

/**
 * Create a new category
 */
export async function createCategory(
  data: CreateCategoryRequest
): Promise<CategoryResponse> {
  const response = await axiosInstance.post<CategoryResponse>(
    "/categories",
    data
  );
  return response.data;
}
