"use client";

import { DataTable } from "@/components/data-table/data-table";
import { getColumns } from "./components/columns";
import { useExportConfig } from "./utils/config";
import { useTestimonialsData } from "./utils/data-fetching";
import { ToolbarOptions } from "./components/toolbar-options";
import { useState } from "react";
import { TestimonialExportData } from "@/types";
import { getTestimonialsForBulkExportByIds } from "@/api/testimonials";
import { formatDateOnly } from "@/lib/format-date";

const fetchByIdsFn = async (
  ids: string[] | number[]
): Promise<TestimonialExportData[]> => {
  const stringIds = ids.map((id) => String(id));
  const testimonials = await getTestimonialsForBulkExportByIds(stringIds, {
    rating: undefined,
    isActive: undefined,
  });

  return (
    testimonials?.data?.map((testimonial) => ({
      id: testimonial.id,
      name: testimonial.name,
      message: testimonial.message || "",
      rating: testimonial.rating,
      position: testimonial.position || "",
      company: testimonial.company || "",
      isActive: testimonial.isActive,
      createdAt: testimonial.createdAt
        ? formatDateOnly(testimonial.createdAt)
        : "",
      updatedAt: testimonial.updatedAt
        ? formatDateOnly(testimonial.updatedAt)
        : "",
    })) || []
  );
};

export default function TestimonialsTable() {
  const exportConfig = useExportConfig();

  return (
    <DataTable<TestimonialExportData, unknown>
      getColumns={getColumns}
      exportConfig={exportConfig}
      fetchDataFn={useTestimonialsData}
      fetchByIdsFn={fetchByIdsFn}
      idField="id"
      pageSizeOptions={[2, 5, 10, 20, 50, 100]}
      renderToolbarContent={({
        selectedRows,
        totalSelectedCount,
        resetSelection,
      }) => (
        <ToolbarOptions
          selectedTestimonials={selectedRows.map((row) => ({
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
        columnResizingTableId: "testimonials-table",
        defaultSortBy: "createdAt",
        defaultSortOrder: "desc",
      }}
    />
  );
}
