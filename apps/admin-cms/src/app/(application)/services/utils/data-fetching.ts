"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getAllServices } from "@/api/services";
import { preprocessSearch } from "@/components/data-table/utils";

export function useServicesData(
  page: number,
  pageSize: number,
  search: string,
  dateRange: { from_date: string; to_date: string },
  sortBy: string,
  sortOrder: string,
  categoryId?: string
) {
  return useQuery({
    queryKey: [
      "services",
      page,
      pageSize,
      preprocessSearch(search),
      dateRange,
      sortBy,
      sortOrder,
      categoryId,
    ],
    queryFn: async () => {
      const response = await getAllServices({
        page,
        limit: pageSize,
        search: preprocessSearch(search),
        sortBy: sortBy as
          | "name"
          | "sortOrder"
          | "createdAt"
          | "updatedAt"
          | "isPremium"
          | "isActive"
          | "price",
        sortOrder: sortOrder as "asc" | "desc",
        from_date: dateRange.from_date,
        to_date: dateRange.to_date,
        categoryId,
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
useServicesData.isQueryHook = true;
