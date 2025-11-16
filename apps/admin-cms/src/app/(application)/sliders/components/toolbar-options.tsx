import * as React from "react";
import { PlusCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import CreateSliderDialog from "./actions/create-slider-dialog";
import { BulkDeleteSlidersDialog } from "./actions/bulk-delete-sliders-dialog";
import { Typography } from "@/components/typography";

interface ToolbarOptionsProps {
  selectedSliders: { id: number; title: string }[];
  totalSelectedCount: number;
  resetSelection: () => void;
}

export const ToolbarOptions = ({
  selectedSliders,
  totalSelectedCount,
  resetSelection,
}: ToolbarOptionsProps) => {
  const [showCreateDialog, setShowCreateDialog] = React.useState(false);
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = React.useState(false);

  const selectedIds = selectedSliders.map((slider) => slider.id);

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <CreateSliderDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />
      <BulkDeleteSlidersDialog
        open={showBulkDeleteDialog}
        onOpenChange={setShowBulkDeleteDialog}
        sliderIds={selectedIds}
        onSuccess={resetSelection}
      />
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowCreateDialog(true)}
      >
        <PlusCircle className="mr-2 h-4 w-4" />
        <Typography variant="Regular_H6">Create Slider</Typography>
      </Button>

      {totalSelectedCount > 0 && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowBulkDeleteDialog(true)}
          className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          <Typography variant="Regular_H6">
            Delete ({totalSelectedCount})
          </Typography>
        </Button>
      )}
    </div>
  );
};
