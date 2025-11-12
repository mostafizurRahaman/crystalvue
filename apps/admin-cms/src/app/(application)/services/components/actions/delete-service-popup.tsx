"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/typography";
import { Loader2 } from "lucide-react";
import { deleteService } from "@/api/services";
import { Service } from "@/types";

interface DeleteServiceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service: Service;
  onSuccess?: () => void;
}

export function DeleteServiceModal({
  open,
  onOpenChange,
  service,
  onSuccess,
}: DeleteServiceModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteService(service.id);
      toast.success(`Successfully deleted service: ${service.name}`);
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error("Delete service error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to delete service"
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            <Typography variant="Bold_H4">Delete Service ?</Typography>
          </DialogTitle>
          <DialogDescription>
            <Typography variant="Regular_H6">
              Are you sure you want to delete &ldquo;{service.name}&rdquo;? This
              action cannot be undone and will also delete all associated
              add-ons.
            </Typography>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
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
            {isDeleting ? "Deleting..." : "Delete Service"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
