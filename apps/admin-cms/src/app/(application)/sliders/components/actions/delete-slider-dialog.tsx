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
import { deleteSlider } from "@/api/sliders";

interface DeleteSliderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sliderId: number;
  sliderTitle: string;
  onSuccess?: () => void;
}

export function DeleteSliderDialog({
  open,
  onOpenChange,
  sliderId,
  sliderTitle,
  onSuccess,
}: DeleteSliderDialogProps) {
  const queryClient = useQueryClient();
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await deleteSlider(sliderId);
      if (response.success) {
        toast.success(response.message);
        queryClient.invalidateQueries({ queryKey: ["sliders"] });
        onOpenChange(false);
        onSuccess?.();
      } else {
        toast.error(response.message || "Failed to delete slider");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete slider. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <Typography variant="Bold_H4" as="span">Delete Slider</Typography>
          </DialogTitle>
          <DialogDescription>
            <Typography variant="Regular_H6">
              Are you sure you want to delete the slider &quot;{sliderTitle}
              &quot;? This action cannot be undone.
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
