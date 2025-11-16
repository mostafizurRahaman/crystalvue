"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getAllContactUs } from "@/api/contact-us";
import { preprocessSearch } from "@/components/data-table/utils";

export function useContactUsData(
  page: number,
  pageSize: number,
  search: string,
  dateRange: { from_date: string; to_date: string },
  sortBy: string,
  sortOrder: string
) {
  return useQuery({
    queryKey: [
      "contact-us",
      page,
      pageSize,
      preprocessSearch(search),
      dateRange,
      sortBy,
      sortOrder,
    ],
    queryFn: async () => {
      const response = await getAllContactUs({
        page,
        limit: pageSize,
        search: preprocessSearch(search),
        sortBy: sortBy as
          | "fullName"
          | "phoneNumber"
          | "email"
          | "parentCategoryId"
          | "serviceId"
          | "status"
          | "createdAt"
          | "updatedAt",
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
useContactUsData.isQueryHook = true;
