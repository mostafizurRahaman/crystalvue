"use client";

import { DataTable } from "@/components/data-table/data-table";
import { getColumns } from "./components/columns";
import { useExportConfig } from "./utils/config";
import { useCategoriesData } from "./utils/data-fetching";
import { ToolbarOptions } from "./components/toolbar-options";
import { CategoryExportData } from "@/types/category";
import { getBulkCategoriesForExport } from "@/api/categories";
import { formatDateOnly } from "@/lib/format-date";

const fetchByIdsFn = async (
  ids: string[] | number[]
): Promise<CategoryExportData[]> => {
  const stringIds = ids.map((id) => String(id));
  const categories = await getBulkCategoriesForExport({ ids: stringIds });

  return (
    categories?.map((category) => ({
      id: category.id,
      name: category.name,
      tagline: category.tagline || "",
      description: category.description || "",
      isActive: category.isActive,
      isPremium: category.isPremium,
      isRepairingService: category.isRepairingService,
      isShowHome: category.isShowHome,
      sortOrder: category.sortOrder,
      createdAt: category.createdAt ? formatDateOnly(category.createdAt) : "",
      updatedAt: category.updatedAt ? formatDateOnly(category.updatedAt) : "",
    })) || []
  );
};

export default function CategoriesTable() {
  const exportConfig = useExportConfig();

  return (
    <DataTable<CategoryExportData, unknown>
      getColumns={getColumns}
      exportConfig={exportConfig}
      fetchDataFn={useCategoriesData}
      fetchByIdsFn={fetchByIdsFn}
      idField="id"
      pageSizeOptions={[2, 5, 10, 20, 50, 100]}
      renderToolbarContent={({
        selectedRows,
        totalSelectedCount,
        resetSelection,
      }) => (
        <ToolbarOptions
          selectedCategories={selectedRows.map((row) => ({
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
        columnResizingTableId: "categories-table",
        defaultSortBy: "createdAt",
        defaultSortOrder: "desc",
      }}
    />
  );
}
