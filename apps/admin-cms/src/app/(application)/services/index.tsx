"use client";
import { useSearchParams } from "next/navigation";
import { DataTable } from "@/components/data-table/data-table";
import { getColumns } from "./components/columns";
import { useExportConfig } from "./utils/config";
import { useServicesData } from "./utils/data-fetching";
import { ToolbarOptions } from "./components/toolbar-options";
import { ServiceExportData } from "@/types";
import { getServicesForBulkExport } from "@/api/services";
import { formatDateOnly } from "@/lib/format-date";

const fetchByIdsFn = async (
  ids: string[] | number[]
): Promise<ServiceExportData[]> => {
  const stringIds = ids.map((id) => String(id));
  const services = await getServicesForBulkExport({
    ids: stringIds,
    limit: stringIds.length,
  });

  return (
    services?.data?.map((service) => ({
      id: service.id,
      name: service.name,
      tagline: service.tagline || "",
      description: service.description || "",
      price: service.price,
      isActive: service.isActive,
      isPremium: service.isPremium,
      sortOrder: 0, // Default value since sortOrder is not available in service model
      parentCategoryId: service.parentCategoryId,
      createdAt: service.createdAt ? formatDateOnly(service.createdAt) : "",
      updatedAt: service.updatedAt ? formatDateOnly(service.updatedAt) : "",
    })) || []
  );
};

export default function ServicesTable() {
  const exportConfig = useExportConfig();
  const searchParams = useSearchParams();

  // Get categoryId from URL search params
  const categoryId = searchParams.get("categoryId") || undefined;

  // Create a wrapper function that includes the categoryId
  const useServicesDataWithCategory = (
    page: number,
    pageSize: number,
    search: string,
    dateRange: { from_date: string; to_date: string },
    sortBy: string,
    sortOrder: string
  ) => {
    return useServicesData(
      page,
      pageSize,
      search,
      dateRange,
      sortBy,
      sortOrder,
      categoryId
    );
  };

  // Add the isQueryHook property
  useServicesDataWithCategory.isQueryHook = true;

  return (
    <DataTable<ServiceExportData, unknown>
      getColumns={getColumns}
      exportConfig={exportConfig}
      fetchDataFn={useServicesDataWithCategory}
      fetchByIdsFn={fetchByIdsFn}
      idField="id"
      pageSizeOptions={[2, 5, 10, 20, 50, 100]}
      renderToolbarContent={({
        selectedRows,
        totalSelectedCount,
        resetSelection,
      }) => (
        <ToolbarOptions
          selectedServices={selectedRows.map((row) => ({
            id: row.id,
            name: row.name,
          }))}
          totalSelectedCount={totalSelectedCount}
          resetSelection={resetSelection}
        />
      )}
      config={{
        enableRowSelection: true,
        enableSearch: true,
        enableDateFilter: true,
        enableColumnVisibility: true,
        enableUrlState: true,
        columnResizingTableId: "services-table",
        defaultSortBy: "createdAt",
        defaultSortOrder: "desc",
      }}
    />
  );
}
