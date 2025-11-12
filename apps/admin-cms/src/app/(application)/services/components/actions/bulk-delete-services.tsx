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

interface BulkDeleteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  services: Array<{ id: string; name: string }>;
  onSuccess?: () => void;
}

export function BulkDeleteModal({
  open,
  onOpenChange,
  services,
  onSuccess,
}: BulkDeleteModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (services.length === 0) return;

    setIsDeleting(true);
    try {
      const deletePromises = services.map(async (service) => {
        await deleteService(service.id);
      });

      await Promise.all(deletePromises);

      toast.success(`Successfully deleted ${services.length} service(s)`);
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error("Bulk delete error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to delete some services"
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
            <Typography variant="Bold_H4">Delete Services</Typography>
          </DialogTitle>
          <DialogDescription>
            <Typography variant="Regular_H6">
              Are you sure you want to delete the following {services.length} services?
              This action cannot be undone.
            </Typography>
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-60 overflow-y-auto">
          <div className="space-y-2">
            {services.map((service) => (
              <div
                key={service.id}
                className="p-2 rounded bg-gray-50 dark:bg-gray-800"
              >
                <Typography variant="Medium_H7">{service.name}</Typography>
              </div>
            ))}
          </div>
        </div>

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
            {isDeleting && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {isDeleting ? "Deleting..." : `Delete ${services.length} Service(s)`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
