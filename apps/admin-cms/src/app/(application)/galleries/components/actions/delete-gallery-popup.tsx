"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { deleteGallery } from "@/api/gallery";
import { Gallery } from "@/types/gallery";

interface DeleteGalleryPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  gallery: Gallery;
  onSuccess?: () => void;
}

export function DeleteGalleryPopup({
  open,
  onOpenChange,
  gallery,
  onSuccess,
}: DeleteGalleryPopupProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!gallery?.id) {
      toast.error("Gallery ID is missing");
      return;
    }

    setIsDeleting(true);
    try {
      const response = await deleteGallery(gallery.id);

      if (response.success) {
        toast.success("Gallery deleted successfully");
        onOpenChange(false);
        onSuccess?.();

        // Refresh data
        router.refresh();
        await queryClient.invalidateQueries({ queryKey: ["galleries"] });
      } else {
        toast.error(response.message || "Failed to delete gallery");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete gallery";
      toast.error(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  if (!gallery) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Delete Gallery Item?
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Are you sure you want to delete this gallery item
            {gallery.caption && <span>&ldquo;{gallery.caption}&rdquo;</span>}
            ? This action cannot be undone and will also delete the associated image from Cloudinary.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
