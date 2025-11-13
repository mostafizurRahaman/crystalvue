"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/typography";
import { Loader2, Mail, User, Calendar } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { deleteContactUs } from "@/api/contact-us";
import { ContactUsExportData } from "./columns";
import { format } from "date-fns";

interface DeleteContactUsPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  inquiry: ContactUsExportData;
  onSuccess?: () => void;
}

export function DeleteContactUsPopup({
  open,
  onOpenChange,
  inquiry,
  onSuccess,
}: DeleteContactUsPopupProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const queryClient = useQueryClient();

  const handleDelete = async () => {
    if (!inquiry.id) {
      toast.error("Inquiry ID is missing");
      return;
    }

    setIsDeleting(true);
    try {
      await deleteContactUs(inquiry.id);
      toast.success(
        `Successfully deleted inquiry from: ${inquiry.name || "Unknown"}`
      );
      onOpenChange(false);
      onSuccess?.();
      queryClient.invalidateQueries({ queryKey: ["contact-us"] });
    } catch (error) {
      console.error("Delete inquiry error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to delete inquiry"
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusColor = (status: string) => {
    const statusColors = {
      pending: "text-yellow-600 bg-yellow-50",
      "in-progress": "text-blue-600 bg-blue-50",
      resolved: "text-green-600 bg-green-50",
      closed: "text-gray-600 bg-gray-50",
    };
    return (
      statusColors[status as keyof typeof statusColors] || statusColors.closed
    );
  };

  const getStatusLabel = (status: string) => {
    const statusLabels = {
      pending: "Pending",
      "in-progress": "In Progress",
      resolved: "Resolved",
      closed: "Closed",
    };
    return statusLabels[status as keyof typeof statusLabels] || status;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            <Typography variant="Bold_H4">Delete Contact Inquiry</Typography>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Typography variant="Regular_H6" className="text-gray-600">
            Are you sure you want to delete this contact inquiry? This action
            cannot be undone.
          </Typography>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={isDeleting}
              onClick={handleDelete}
              className="cursor-pointer"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
