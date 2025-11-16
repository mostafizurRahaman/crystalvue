"use client";

import { DataTable } from "@/components/data-table/data-table";
import { getColumns } from "./components/columns";
import { useExportConfig } from "./utils/config";
import { useSlidersData } from "./utils/data-fetching";
import { getSlidersBatch } from "@/api/sliders";
import { ToolbarOptions } from "./components/toolbar-options";

// Flattened type for export (only primitive types)
type SliderExportData = {
  id: number;
  title: string;
  subtitle: string | null;
  buttonText: string | null;
  buttonUrl: string | null;
  isActive: boolean;
  orderNumber: number;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

export default function SlidersTable() {
  const exportConfig = useExportConfig();

  return (
    <DataTable<SliderExportData, unknown>
      getColumns={getColumns}
      exportConfig={exportConfig}
      fetchDataFn={useSlidersData}
      fetchByIdsFn={async (
        ids: (number | string)[]
      ): Promise<SliderExportData[]> => {
        const numericIds = ids.map((id) =>
          typeof id === "string" ? parseInt(id, 10) : id
        );
        const sliders = await getSlidersBatch(numericIds);
        // Transform to flat structure for export
        return sliders.map((slider) => ({
          id: slider.id,
          title: slider.title,
          subtitle: slider.subtitle,
          buttonText: slider.buttonText,
          buttonUrl: slider.buttonUrl,
          isActive: slider.isActive,
          orderNumber: slider.orderNumber,
          imageUrl: slider.image?.url ?? null,
          createdAt: slider.createdAt,
          updatedAt: slider.updatedAt,
        }));
      }}
      idField="id"
      pageSizeOptions={[10, 20, 50, 100]}
      renderToolbarContent={({
        selectedRows,
        totalSelectedCount,
        resetSelection,
      }) => (
        <ToolbarOptions
          selectedSliders={selectedRows.map((row) => ({
            id: row.id,
            title: row.title,
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
        columnResizingTableId: "sliders-table",
      }}
    />
  );
}
