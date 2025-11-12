import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getAllSliders } from "@/api/sliders";
import { preprocessSearch } from "@/components/data-table/utils";

// Sort mapping for frontend column keys to backend sort fields
const sortMapping: Record<string, string> = {
  title: "title",
  isActive: "isActive",
  orderNumber: "orderNumber",
  createdAt: "created_at",
  updatedAt: "updated_at",
};

export function useSlidersData(
  page: number,
  pageSize: number,
  search: string,
  dateRange: { from_date: string; to_date: string },
  sortBy: string,
  sortOrder: string
) {
  // Map frontend sort field to backend sort field
  const backendSortBy = sortMapping[sortBy] || "orderNumber";

  return useQuery({
    queryKey: [
      "sliders",
      page,
      pageSize,
      preprocessSearch(search),
      dateRange,
      sortBy,
      sortOrder,
    ],
    queryFn: () =>
      getAllSliders({
        page,
        limit: pageSize,
        search: preprocessSearch(search),
        from_date: dateRange.from_date,
        to_date: dateRange.to_date,
        sort_by: backendSortBy as
          | "created_at"
          | "updated_at"
          | "orderNumber"
          | "title"
          | "isActive",
        sort_order: sortOrder as "asc" | "desc",
      }),
    placeholderData: keepPreviousData,
  });
}

// Add this property for the DataTable component
useSlidersData.isQueryHook = true;
