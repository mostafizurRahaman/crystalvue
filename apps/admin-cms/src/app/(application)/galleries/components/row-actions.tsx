"use client";

import * as React from "react";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Row, Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Typography } from "@/components/typography";
import { Gallery } from "@/types/gallery";
import { DeleteGalleryPopup } from "./actions/delete-gallery-popup";
import { EditGalleryPopup } from "./actions/edit-gallery-popup";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
  table: Table<TData>;
}

export function DataTableRowActions<TData>({
  row,
  table,
}: DataTableRowActionsProps<TData>) {
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [editDialogOpen, setEditDialogOpen] = React.useState(false);
  const gallery = row.original as Gallery;

  // Function to reset all selections
  const resetSelection = () => {
    table.resetRowSelection();
  };

  // Handle edit function
  const handleEdit = () => {
    setEditDialogOpen(true);
  };

  // Handle view details function
  const handleViewDetails = () => {
    console.log("View gallery details:", gallery);
    // Implement view details logic or navigation
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <DotsHorizontalIcon className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem onClick={handleEdit}>
            <Typography variant="Regular_H7">Edit</Typography>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setDeleteDialogOpen(true)}>
            <Typography variant="Regular_H7">Delete</Typography>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditGalleryPopup
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        gallery={gallery}
        onSuccess={resetSelection}
      />

      <DeleteGalleryPopup
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        gallery={gallery}
        onSuccess={resetSelection}
      />
    </>
  );
}
