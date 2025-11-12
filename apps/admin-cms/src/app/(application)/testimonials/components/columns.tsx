"use client";

import { format } from "date-fns";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table/column-header";
import { Checkbox } from "@/components/ui/checkbox";
import { StatusChips } from "@/components/badges/status-switcher";
import { Typography } from "@/components/typography";
import { Star } from "lucide-react";
import { TestimonialExportData } from "@/types";
import { DataTableRowActions } from "./row-actions";

export const getColumns = (
  handleRowDeselection: ((rowId: string) => void) | null | undefined
): ColumnDef<TestimonialExportData>[] => {
  const baseColumns: ColumnDef<TestimonialExportData>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
      cell: ({ row }) => (
        <div className="font-medium">
          <Typography variant="Medium_H6">{row.getValue("name")}</Typography>
        </div>
      ),
      size: 200,
    },
    {
      accessorKey: "message",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Message" />
      ),
      cell: ({ row }) => {
        const message = row.getValue("message") as string;
        return (
          <div className="max-w-[300px]">
            <Typography variant="Regular_H7" maxLines={2}>
              {message || "—"}
            </Typography>
          </div>
        );
      },
      size: 300,
    },
    {
      accessorKey: "rating",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Rating" />
      ),
      cell: ({ row }) => {
        const rating = row.getValue("rating") as number;
        return (
          <div className="flex items-center space-x-1">
            <Typography variant="Regular_H7">{rating}</Typography>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < rating
                      ? "text-yellow-400 fill-current"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
        );
      },
      size: 100,
    },
    {
      accessorKey: "position",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Position" />
      ),
      cell: ({ row }) => {
        const position = row.getValue("position") as string;
        return (
          <div className="max-w-[150px]">
            <Typography variant="Regular_H7" maxLines={1}>
              {position || "—"}
            </Typography>
          </div>
        );
      },
      size: 150,
    },
    {
      accessorKey: "company",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Company" />
      ),
      cell: ({ row }) => {
        const company = row.getValue("company") as string;
        return (
          <div className="max-w-[150px]">
            <Typography variant="Regular_H7" maxLines={1}>
              {company || "—"}
            </Typography>
          </div>
        );
      },
      size: 150,
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
      cell: ({ row }) => <DataTableRowActions row={row} />,
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
