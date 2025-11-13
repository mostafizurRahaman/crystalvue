"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, Trash2, Edit } from "lucide-react";
import { ContactUsExportData } from "./columns";
import { useState } from "react";
import { UpdateStatusPopup } from "./update-status-popup";
import { DeleteContactUsPopup } from "./delete-contact-us-popup";

interface DataTableRowActionsProps<TData> {
  row: {
    id: string;
    original: TData;
  };
  table: {
    getIsAllPageRowsSelected: () => boolean;
    getIsSomePageRowsSelected: () => boolean;
    toggleAllPageRowsSelected: (value: boolean) => void;
  };
}

export function DataTableRowActions<TData extends ContactUsExportData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const [showUpdateStatus, setShowUpdateStatus] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);

  const inquiry = row.original;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted cursor-pointer"
          >
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => setShowUpdateStatus(true)}
            className="cursor-pointer"
          >
            <Edit className="mr-2 h-4 w-4" />
            Update Status
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setShowDeletePopup(true)}
            className="cursor-pointer text-red-600 focus:text-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <UpdateStatusPopup
        open={showUpdateStatus}
        onOpenChange={setShowUpdateStatus}
        inquiry={inquiry}
      />

      <DeleteContactUsPopup
        open={showDeletePopup}
        onOpenChange={setShowDeletePopup}
        inquiry={inquiry}
      />
    </>
  );
}
