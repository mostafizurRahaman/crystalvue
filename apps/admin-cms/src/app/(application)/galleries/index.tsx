"use client";

import { DataTable } from "@/components/data-table/data-table";
import { getColumns } from "./components/columns";
import { useExportConfig } from "./utils/config";
import { useGalleriesData } from "./utils/data-fetching";
import { ToolbarOptions } from "./components/toolbar-options";
import { GalleryExportData } from "@/types/gallery";
import { getGalleriesForBulkExport } from "@/api/gallery";
import { formatDateOnly } from "@/lib/format-date";

const fetchByIdsFn = async (
  ids: string[] | number[]
): Promise<GalleryExportData[]> => {
  const stringIds = ids.map((id) => String(id));
  const galleries = await getGalleriesForBulkExport({ ids: stringIds });

  return (
    galleries?.data?.map((gallery) => ({
      id: gallery.id,
      caption: gallery.caption || "",
      isActive: gallery.isActive,
      galleryCategory: gallery.galleryCategory || null,
      imageId: gallery.imageId,
      createdAt: gallery.createdAt
        ? formatDateOnly(new Date(gallery.createdAt))
        : "",
      updatedAt: gallery.updatedAt
        ? formatDateOnly(new Date(gallery.updatedAt))
        : "",
      imageUrl: gallery.image?.url || "",
      imagePublicId: gallery.image?.publicId || "",
    })) || []
  );
};

export default function GalleriesTable() {
  const exportConfig = useExportConfig();

  return (
    <DataTable<GalleryExportData, unknown>
      getColumns={getColumns}
      exportConfig={exportConfig}
      fetchDataFn={useGalleriesData}
      fetchByIdsFn={fetchByIdsFn}
      idField="id"
      pageSizeOptions={[2, 5, 10, 20, 50, 100]}
      renderToolbarContent={({
        selectedRows,
        totalSelectedCount,
        resetSelection,
      }) => (
        <ToolbarOptions
          selectedGalleries={selectedRows.map((row) => ({
            id: row.id,
            caption: row.caption,
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
        columnResizingTableId: "galleries-table",
        defaultSortBy: "createdAt",
        defaultSortOrder: "desc",
      }}
    />
  );
}
