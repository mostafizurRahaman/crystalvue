"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getAllTestimonials } from "@/api/testimonials";
import { preprocessSearch } from "@/components/data-table/utils";
import { useSearchParams } from "next/navigation";

export function useTestimonialsData(
  page: number,
  pageSize: number,
  search: string,
  dateRange: { from_date: string; to_date: string },
  sortBy: string,
  sortOrder: string
) {
  const searchParams = useSearchParams();
  const urlRating = searchParams.get("rating");
  const urlIsActive = searchParams.get("isActive");

  const ratingParam = urlRating
    ? urlRating === "all"
      ? undefined
      : parseInt(urlRating)
    : undefined;
  const isActiveParam =
    urlIsActive !== undefined
      ? urlIsActive === "true"
        ? true
        : urlIsActive === "false"
          ? false
          : undefined
      : undefined;

  return useQuery({
    queryKey: [
      "testimonials",
      page,
      pageSize,
      preprocessSearch(search),
      dateRange,
      sortBy,
      sortOrder,
      ratingParam,
      isActiveParam,
    ],
    queryFn: async () => {
      const response = await getAllTestimonials({
        page,
        limit: pageSize,
        search: preprocessSearch(search),
        sortBy: sortBy as "name" | "createdAt" | "rating",
        sortOrder: sortOrder as "asc" | "desc",
        from_date: dateRange.from_date,
        to_date: dateRange.to_date,
        rating: ratingParam,
        isActive: isActiveParam,
      });

      console.log("HOOK", {
        response,
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
useTestimonialsData.isQueryHook = true;
