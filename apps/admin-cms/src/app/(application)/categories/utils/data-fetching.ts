"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getAllCategories } from "@/api/categories";
import { preprocessSearch } from "@/components/data-table/utils";

export function useCategoriesData(
  page: number,
  pageSize: number,
  search: string,
  dateRange: { from_date: string; to_date: string },
  sortBy: string,
  sortOrder: string
) {
  return useQuery({
    queryKey: [
      "categories",
      page,
      pageSize,
      preprocessSearch(search),
      dateRange,
      sortBy,
      sortOrder,
    ],
    queryFn: async () => {
      const response = await getAllCategories({
        page,
        limit: pageSize,
        search: preprocessSearch(search),
        sortBy: sortBy as
          | "name"
          | "sortOrder"
          | "createdAt"
          | "updatedAt"
          | "isPremium"
          | "isActive",
        sortOrder: sortOrder as "asc" | "desc",
        from_date: dateRange.from_date,
        to_date: dateRange.to_date,
      });

      return {
        success: response.success,
        data: response.data,
        pagination: response.pagination,
      };
    },
    placeholderData: keepPreviousData,
  });
}

// Add this property for the DataTable component
useCategoriesData.isQueryHook = true;
