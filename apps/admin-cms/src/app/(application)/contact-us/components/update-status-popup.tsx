"use client";

import { useEffect, useState } from "react";
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
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQueryClient } from "@tanstack/react-query";
import { updateContactUsStatus } from "@/api/contact-us";
import { ContactUsExportData } from "./columns";

const updateStatusSchema = z.object({
  status: z.enum(["pending", "in-progress", "resolved", "closed"], {
    message: "Please select a status",
  }),
});

type UpdateStatusFormData = z.infer<typeof updateStatusSchema>;

interface UpdateStatusPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  inquiry: ContactUsExportData;
  onSuccess?: () => void;
}

export function UpdateStatusPopup({
  open,
  onOpenChange,
  inquiry,
  onSuccess,
}: UpdateStatusPopupProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<UpdateStatusFormData>({
    resolver: zodResolver(updateStatusSchema),
    defaultValues: {
      status: inquiry.status as
        | "pending"
        | "in-progress"
        | "resolved"
        | "closed",
    },
    mode: "onSubmit",
  });

  useEffect(() => {
    if (inquiry && open) {
      form.reset({
        status: inquiry.status as
          | "pending"
          | "in-progress"
          | "resolved"
          | "closed",
      });
    }
  }, [inquiry, open, form]);

  const onSubmit = async (data: UpdateStatusFormData) => {
    if (!inquiry.id) {
      toast.error("Inquiry ID is missing");
      return;
    }

    setIsSubmitting(true);
    try {
      await updateContactUsStatus(inquiry.id, data);
      toast.success(
        `Status updated to: ${data.status.replace("-", " ").charAt(0).toUpperCase() + data.status.slice(1).replace("-", " ")}`
      );
      onOpenChange(false);
      onSuccess?.();
      queryClient.invalidateQueries({ queryKey: ["contact-us"] });
    } catch (error) {
      console.error("Update status error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update status"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const statusOptions = [
    { value: "pending", label: "Pending", color: "text-yellow-600" },
    { value: "in-progress", label: "In Progress", color: "text-blue-600" },
    { value: "resolved", label: "Resolved", color: "text-green-600" },
    { value: "closed", label: "Closed", color: "text-gray-600" },
  ];

  const getStatusColor = (status: string) => {
    return (
      statusOptions.find((option) => option.value === status)?.color ||
      "text-gray-600"
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            <Typography variant="Bold_H5">Update Inquiry Status</Typography>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Typography variant="Regular_H6">Status</Typography>
              <Select
                value={form.watch("status")}
                onValueChange={(value) =>
                  form.setValue(
                    "status",
                    value as "pending" | "in-progress" | "resolved" | "closed"
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center space-x-2">
                        <span className={option.color}>{option.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.status && (
                <Typography variant="Regular_H7" className="text-red-500">
                  {form.formState.errors.status.message}
                </Typography>
              )}
            </div>

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
                type="submit"
                disabled={isSubmitting}
                className="cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Status"
                )}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
