import axiosInstance from "@/configs/axios";
import { ApiResponse } from "@/configs/axios";
import {
  CategoriesForExportResponse,
  Category,
  GetBulkCategoriesRequest,
} from "@/types/category";

/**
 * Get bulk categories for export with optional filtering
 */
export async function getBulkCategoriesForExport(
  params: GetBulkCategoriesRequest = {}
): Promise<Category[]> {
  const { ids } = params;

  const stringIds = ids?.map((id) => String(id));

  console.log({ stringIds });
  const response = await axiosInstance.get<CategoriesForExportResponse>(
    `/categories/bulk/export?ids=${stringIds?.join(",")}`
  );
  return response.data?.data || [];
}
