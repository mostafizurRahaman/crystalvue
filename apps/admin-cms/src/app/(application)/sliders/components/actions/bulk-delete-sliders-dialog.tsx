import * as React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Typography } from "@/components/typography";
import { bulkDeleteSliders } from "@/api/sliders";

interface BulkDeleteSlidersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sliderIds: number[];
  onSuccess?: () => void;
}

export function BulkDeleteSlidersDialog({
  open,
  onOpenChange,
  sliderIds,
  onSuccess,
}: BulkDeleteSlidersDialogProps) {
  const queryClient = useQueryClient();
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await bulkDeleteSliders(sliderIds);
      if (response.success) {
        toast.success(response.message);
        queryClient.invalidateQueries({ queryKey: ["sliders"] });
        onOpenChange(false);
        onSuccess?.();
      } else {
        toast.error(response.message || "Failed to delete sliders");
      }
    } catch (error) {
      console.error("Bulk delete error:", error);
      toast.error("Failed to delete sliders. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <Typography variant="Bold_H4" as="span">Delete Sliders</Typography>
          </DialogTitle>
          <DialogDescription>
            <Typography variant="Regular_H6">
              Are you sure you want to delete {sliderIds.length} selected
              slider(s)? This action cannot be undone.
            </Typography>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            <Typography variant="Medium_H6">Cancel</Typography>
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            <Typography variant="Medium_H6">
              {isDeleting ? "Deleting..." : "Delete"}
            </Typography>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
