"use client";

import { format } from "date-fns";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table/column-header";
import { Checkbox } from "@/components/ui/checkbox";
import { StatusChips } from "@/components/badges/status-switcher";
import { Typography } from "@/components/typography";
import { Gallery, GalleryExportData, GalleryCategory } from "@/types/gallery";
import { DataTableRowActions } from "./row-actions";
import { ImageCell } from "@/components/image-viewer";

const galleryCategoryLabels: Record<GalleryCategory, string> = {
  SHOWER_ENCLOSURES: "Shower Enclosures",
  GLASS_DOORS: "Glass doors",
  RAILINGS: "Railings",
  WINDOWS: "Windows",
  UPVC: "UPVC",
};

export const getColumns = (
  handleRowDeselection: ((rowId: string) => void) | null | undefined
): ColumnDef<GalleryExportData>[] => {
  const baseColumns: ColumnDef<GalleryExportData>[] = [
    {
      accessorKey: "caption",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Caption" />
      ),
      cell: ({ row }) => (
        <div className="font-medium">
          <Typography variant="Medium_H6">
            {row.original.caption || "—"}
          </Typography>
        </div>
      ),
      size: 200,
    },
    {
      accessorKey: "galleryCategory",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Category" />
      ),
      cell: ({ row }) => {
        const galleryCategory = row.original
          .galleryCategory as GalleryCategory | null;
        const displayLabel = galleryCategory
          ? galleryCategoryLabels[galleryCategory]
          : "—";
        return (
          <div className="max-w-[150px]">
            <Typography variant="Regular_H7" maxLines={2}>
              {displayLabel}
            </Typography>
          </div>
        );
      },
      size: 150,
    },
    {
      accessorKey: "imageUrl",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Image" />
      ),
      cell: ({ row }) => {
        const imageUrl = row.original.image?.url as string;
        const caption = row.original.caption as string;
        return (
          <ImageCell imageUrl={imageUrl} title={caption || "Gallery image"} />
        );
      },
      size: 100,
      enableSorting: false,
    },
    {
      accessorKey: "isActive",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => {
        const isActive = row.getValue("isActive") as boolean;
        return <StatusChips status={isActive ? "active" : "inactive"} />;
      },
      size: 100,
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Created" />
      ),
      cell: ({ row }) => {
        const date = new Date(row.getValue("createdAt"));
        return (
          <div>
            <Typography variant="Regular_H7">
              {format(date, "MMM d, yyyy")}
            </Typography>
          </div>
        );
      },
      size: 120,
    },
    {
      id: "actions",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Actions" />
      ),
      cell: ({ row, table }) => <DataTableRowActions row={row} table={table} />,
      size: 100,
    },
  ];

  // Only include selection column if row selection is enabled
  if (handleRowDeselection !== null) {
    return [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
            className="translate-y-0.5 cursor-pointer"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => {
              row.toggleSelected(!!value);
              if (!value && handleRowDeselection) {
                handleRowDeselection(row.id);
              }
            }}
            aria-label="Select row"
            className="translate-y-0.5 cursor-pointer"
          />
        ),
        enableSorting: false,
        enableHiding: false,
        size: 50,
      },
      ...baseColumns,
    ];
  }

  return baseColumns;
};
