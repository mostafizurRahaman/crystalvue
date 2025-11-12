"use client";

import * as React from "react";
import { PlusCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/typography";
import { AddCategoryPopup } from "./actions/add-category-popup";
import { BulkDeletePopup } from "./actions/bulk-delete-popup";

interface ToolbarOptionsProps {
  selectedCategories: { id: string; name: string }[];
  allSelectedIds?: string[];
  totalSelectedCount: number;
  resetSelection: () => void;
}

export const ToolbarOptions = ({
  selectedCategories,
  allSelectedIds = [],
  totalSelectedCount,
  resetSelection,
}: ToolbarOptionsProps) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);

  return (
    <div className="flex items-center gap-2">
      <AddCategoryPopup />

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
            selectedCategories={selectedCategories}
            allSelectedIds={allSelectedIds}
            totalSelectedCount={totalSelectedCount}
            resetSelection={resetSelection}
          />
        </>
      )} */}
    </div>
  );
};
