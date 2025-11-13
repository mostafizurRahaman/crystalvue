"use client";

import { DataTable } from "@/components/data-table/data-table";
import { getColumns } from "./components/columns";
import { useExportConfig } from "./utils/config";
import { useContactUsData } from "./utils/data-fetching";
import { ToolbarOptions } from "./components/toolbar-options";
import { getBulkContactUsForExport } from "@/api/contact-us";
import { formatDateOnly } from "@/lib/format-date";
import type { ExportableData } from "@/components/data-table/utils/export-utils";
import type { ColumnDef } from "@tanstack/react-table";

export interface ContactUsExportData {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: string;
  images: string[];
  createdAt: string;
  updatedAt: string;
}

// Type alias to satisfy ExportableData constraint (images is handled by transform function)
type ContactUsTableData = ContactUsExportData & ExportableData;

const fetchByIdsFn = async (
  ids: string[] | number[]
): Promise<ContactUsExportData[]> => {
  const stringIds = ids.map((id) => String(id));
  const inquiries = await getBulkContactUsForExport(stringIds);

  return (
    inquiries?.map(
      (inquiry) =>
        ({
          id: inquiry.id,
          name: inquiry.fullName,
          email: inquiry.email,
          phone: inquiry.phoneNumber || "",
          subject: inquiry.subject,
          message: inquiry.message,
          status: inquiry.status,
          images: inquiry.images?.map((image) => image.url) || [],
          createdAt: inquiry.createdAt ? formatDateOnly(inquiry.createdAt) : "",
          updatedAt: inquiry.updatedAt ? formatDateOnly(inquiry.updatedAt) : "",
        }) as ContactUsExportData
    ) || []
  );
};

export default function ContactUsTable() {
  const exportConfig = useExportConfig();

  return (
    <DataTable<ContactUsTableData, unknown>
      getColumns={
        getColumns as (
          handleRowDeselection: ((rowId: string) => void) | null | undefined
        ) => ColumnDef<ContactUsTableData, unknown>[]
      }
      exportConfig={exportConfig}
      fetchDataFn={useContactUsData}
      fetchByIdsFn={
        fetchByIdsFn as (
          ids: string[] | number[]
        ) => Promise<ContactUsTableData[]>
      }
      idField="id"
      pageSizeOptions={[2, 5, 10, 20, 50, 100]}
      renderToolbarContent={({
        selectedRows,
        totalSelectedCount,
        resetSelection,
      }: {
        selectedRows: ContactUsTableData[];
        totalSelectedCount: number;
        resetSelection: () => void;
      }) => (
        <ToolbarOptions
          selectedInquiries={selectedRows.map((row) => ({
            id: (row as ContactUsExportData).id,
            name: (row as ContactUsExportData).name,
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
        columnResizingTableId: "contact-us-table",
        defaultSortBy: "createdAt",
        defaultSortOrder: "desc",
      }}
    />
  );
}
