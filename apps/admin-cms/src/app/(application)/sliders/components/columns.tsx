import { format } from "date-fns";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table/column-header";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableRowActions } from "./row-action";
import { Typography } from "@/components/typography";
import { Badge } from "@/components/ui/badge";
import { StatusChips } from "@/components/badges/status-switcher";
import { ImageCell } from "./image-cell";

// Flattened type for export (only primitive types)
type SliderExportData = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [x: string]: any;
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
};

export const getColumns = (
  handleRowDeselection?: ((rowId: string) => void) | null
): ColumnDef<SliderExportData>[] => {
  const baseColumns: ColumnDef<SliderExportData>[] = [
    {
      accessorKey: "id",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="ID" />
      ),
      cell: ({ row }) => (
        <Typography variant="Regular_H6">{row.getValue("id")}</Typography>
      ),
      size: 100,
    },
    {
      accessorKey: "title",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Title" />
      ),
      cell: ({ row }) => (
        <Typography variant="Regular_H6">{row.getValue("title")}</Typography>
      ),
      size: 250,
    },

    {
      accessorKey: "subtitle",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Subtitle" />
      ),
      cell: ({ row }) => (
        <Typography variant="Regular_H6">{row.getValue("subtitle")}</Typography>
      ),
      size: 250,
    },
    {
      accessorKey: "buttonText",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Button Text" />
      ),
      cell: ({ row }) => (
        <Typography variant="Regular_H6">
          {row.getValue("buttonText")}
        </Typography>
      ),
      size: 250,
    },
    {
      accessorKey: "buttonUrl",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Button URL" />
      ),
      cell: ({ row }) => (
        <Typography variant="Regular_H6">
          {row.getValue("buttonUrl")}
        </Typography>
      ),
      size: 250,
    },
    {
      accessorKey: "isActive",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => {
        const isActive = row.getValue("isActive");
        return <StatusChips status={isActive ? "active" : "inactive"} />;
      },
      size: 120,
    },
    {
      accessorKey: "imageUrl",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Image" />
      ),
      cell: ({ row }) => {
        // @ts-nocheck
        const imageUrl = row.original?.image?.url;
        const title = row.original.title;
        return <ImageCell imageUrl={imageUrl} title={title} />;
      },
      enableSorting: false,
      size: 120,
    },
    {
      accessorKey: "orderNumber",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Order" />
      ),
      cell: ({ row }) => (
        <Badge variant="outline" className="">
          <Typography variant="Regular_H6">
            {row.getValue("orderNumber")}
          </Typography>
        </Badge>
      ),
      size: 80,
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Created At" />
      ),
      cell: ({ row }) => {
        const date = new Date(row.getValue("createdAt"));
        return (
          <Typography variant="Regular_H7">
            {format(date, "MMM d, yyyy")}
          </Typography>
        );
      },
      size: 150,
    },
    {
      id: "actions",
      cell: ({ row, table }) => <DataTableRowActions row={row} table={table} />,
      enableSorting: false,
      enableHiding: false,
      size: 80,
    },
  ];

  if (handleRowDeselection) {
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
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => {
              row.toggleSelected(!!value);
              if (!value) {
                handleRowDeselection(row.id);
              }
            }}
            aria-label="Select row"
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
