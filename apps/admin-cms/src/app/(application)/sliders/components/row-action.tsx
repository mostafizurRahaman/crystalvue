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
import { Slider } from "@/schemas/sliders";
import { DeleteSliderDialog } from "./actions/delete-slider-dialog";
import { EditSliderDialog } from "./actions/edit-slider-dialog";
import { Typography } from "@/components/typography";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
  table: Table<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [showEditDialog, setShowEditDialog] = React.useState(false);

  const slider = row.original as Slider;

  return (
    <>
      <DeleteSliderDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        sliderId={slider.id}
        sliderTitle={slider.title}
      />
      <EditSliderDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        slider={slider}
      />
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
          <DropdownMenuItem onSelect={() => setShowEditDialog(true)}>
            <Typography variant="Regular_H7">Edit</Typography>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => setShowDeleteDialog(true)}>
            <Typography variant="Regular_H7" className="text-red-500">
              Delete
            </Typography>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
