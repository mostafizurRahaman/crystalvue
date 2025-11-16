import axiosInstance from "@/configs/axios";
import { SelectOption } from "@/components/async-searchable-select";
import { Category } from "@/types/category";

/**
 * Search categories for dropdown/select components
 * Returns categories in the format expected by AsyncSearchableSelect
 */
export async function searchCategories(
  searchQuery?: string
): Promise<SelectOption[]> {
  try {
    const params = new URLSearchParams();
    params.append("page", "1");
    params.append("limit", "100"); // Get more results for search
    params.append("sortBy", "name");
    params.append("sortOrder", "asc");
    params.append("isActive", "true"); // Only active categories

    if (searchQuery && searchQuery.trim()) {
      params.append("search", searchQuery.trim());
    }

    const response = await axiosInstance.get(
      `/categories?${params.toString()}`
    );

    if (response.data?.success && Array.isArray(response.data.data)) {
      return response.data.data.map((category: Category) => ({
        value: category.id,
        label: category.name,
      }));
    }

    return [];
  } catch (error) {
    console.error("Error searching categories:", error);
    return [];
  }
}
