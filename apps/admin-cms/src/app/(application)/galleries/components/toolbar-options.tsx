"use client";

import * as React from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/typography";
import { AddGalleryPopup } from "./actions/add-gallery-popup";

interface ToolbarOptionsProps {
  selectedGalleries: { id: string; caption: string | null }[];
  allSelectedIds?: string[];
  totalSelectedCount: number;
  resetSelection: () => void;
}

export const ToolbarOptions = ({
  selectedGalleries,
  allSelectedIds = [],
  totalSelectedCount,
  resetSelection,
}: ToolbarOptionsProps) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);

  return (
    <div className="flex items-center gap-2">
      <AddGalleryPopup />

      {/* {totalSelectedCount > 0 && (
        <>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setDeleteDialogOpen(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            <Typography variant="Medium_H7">
              Delete ({totalSelectedCount})
            </Typography>
          </Button>

          <BulkDeletePopup
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            selectedGalleries={selectedGalleries}
            allSelectedIds={allSelectedIds}
            totalSelectedCount={totalSelectedCount}
            resetSelection={resetSelection}
          />
        </>
      )} */}
    </div>
  );
};
