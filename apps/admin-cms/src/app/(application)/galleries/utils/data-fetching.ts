"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getAllGalleries } from "@/api/gallery";
import { preprocessSearch } from "@/components/data-table/utils";

export function useGalleriesData(
  page: number,
  pageSize: number,
  search: string,
  dateRange: { from_date: string; to_date: string },
  sortBy: string,
  sortOrder: string
) {
  return useQuery({
    queryKey: [
      "galleries",
      page,
      pageSize,
      preprocessSearch(search),
      dateRange,
      sortBy,
      sortOrder,
    ],
    queryFn: async () => {
      const response = await getAllGalleries({
        page,
        limit: pageSize,
        search: preprocessSearch(search),
        sortBy: sortBy as "createdAt" | "caption",
        sortOrder: sortOrder as "asc" | "desc",
        from_date: dateRange.from_date,
        to_date: dateRange.to_date,
        galleryCategory: undefined, // Can be filtered by URL params if needed
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
useGalleriesData.isQueryHook = true;
