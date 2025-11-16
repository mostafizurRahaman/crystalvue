"use client";

import { format } from "date-fns";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table/column-header";
import { Checkbox } from "@/components/ui/checkbox";
import { StatusChips, IStatus } from "@/components/badges/status-switcher";
import { Typography } from "@/components/typography";

import { DataTableRowActions } from "./row-actions";
import { ImageCell } from "./image-cell";
import { ContactInquiry } from "@/types";

export interface ContactUsExportData {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export const getColumns = (
  handleRowDeselection: ((rowId: string) => void) | null | undefined
): ColumnDef<ContactUsExportData>[] => {
  const baseColumns: ColumnDef<ContactUsExportData>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
      cell: ({ row }) => (
        <div className="font-medium">
          <Typography variant="Medium_H6">
            {(row.original as unknown as ContactInquiry)?.fullName}
          </Typography>
        </div>
      ),
      size: 150,
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Email" />
      ),
      cell: ({ row }) => {
        const email = row.getValue("email") as string;
        return (
          <div className="max-w-[200px]">
            <Typography variant="Regular_H7" maxLines={1}>
              {email || "—"}
            </Typography>
          </div>
        );
      },
      size: 200,
    },
    {
      accessorKey: "phone",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Phone" />
      ),
      cell: ({ row }) => {
        const phone = (row.original as unknown as ContactInquiry)?.phoneNumber;
        return <Typography variant="Regular_H7">{phone || "—"}</Typography>;
      },
      size: 120,
    },
    // {
    //   accessorKey: "subject",
    //   header: ({ column }) => (
    //     <DataTableColumnHeader column={column} title="Subject" />
    //   ),
    //   cell: ({ row }) => {
    //     const subject = row.getValue("subject") as string;
    //     return (
    //       <div className="max-w-[250px]">
    //         <Typography variant="Regular_H7" maxLines={2}>
    //           {subject || "—"}
    //         </Typography>
    //       </div>
    //     );
    //   },
    //   size: 250,
    // },
    {
      accessorKey: "message",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Message" />
      ),
      cell: ({ row }) => {
        const message = row.getValue("message") as string;
        return (
          <div className="max-w-[300px]">
            <Typography variant="Regular_H7" maxLines={3}>
              {message || "—"}
            </Typography>
          </div>
        );
      },
      size: 300,
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => {
        const status = (row.getValue("status") as string)?.toUpperCase();
        const statusMap: Record<string, { status: IStatus; label: string }> = {
          PENDING: { status: "pending", label: "Pending" },
          APPROVED: { status: "approved", label: "Approved" },
          REJECTED: { status: "rejected", label: "Rejected" },
        };
        const statusConfig = statusMap[status] || statusMap.PENDING;
        return <StatusChips status={statusConfig.status} />;
      },
      size: 120,
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
      accessorKey: "images",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Images" />
      ),
      cell: ({ row }) => {
        const images = row.getValue("images") as string[];
        const inquiryName = row.getValue("name") as string;

        return (
          <ImageCell images={images} title={`Images from ${inquiryName}`} />
        );
      },
      size: 120,
      enableSorting: false,
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
