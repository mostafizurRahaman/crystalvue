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
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQueryClient } from "@tanstack/react-query";
import { updateContactUsStatus } from "@/api/contact-us";
import { ContactUsExportData } from "./columns";
import type { UpdateStatusRequest } from "@/api/contact-us/types";

const updateStatusSchema = z
  .object({
    status: z.enum(["PENDING", "APPROVED", "REJECTED"], {
      message: "Please select a status",
    }),
    reason: z
      .string()
      .max(500, "Reason too long (max 500 characters)")
      .trim()
      .optional(),
  })
  .refine(
    (data) => {
      if (data.status === "REJECTED" && !data.reason) {
        return false;
      }
      return true;
    },
    {
      message: "Reason is required when status is REJECTED",
      path: ["reason"],
    }
  );

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
      status:
        (inquiry.status?.toUpperCase() as
          | "PENDING"
          | "APPROVED"
          | "REJECTED") || "PENDING",
      reason: undefined,
    },
    mode: "onSubmit",
  });

  useEffect(() => {
    if (inquiry && open) {
      form.reset({
        status:
          (inquiry.status?.toUpperCase() as
            | "PENDING"
            | "APPROVED"
            | "REJECTED") || "PENDING",
        reason: undefined,
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
      // Only include reason if it has a value
      const payload: UpdateStatusRequest = {
        status: data.status,
        ...(data.reason && { reason: data.reason }),
      };

      await updateContactUsStatus(inquiry.id, payload);
      const statusLabel =
        statusOptions.find((opt) => opt.value === data.status)?.label ||
        data.status;
      toast.success(`Status updated to: ${statusLabel}`);
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
    { value: "PENDING", label: "Pending", color: "text-yellow-600" },
    { value: "APPROVED", label: "Approved", color: "text-green-600" },
    { value: "REJECTED", label: "Rejected", color: "text-red-600" },
  ];

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
                    value as "PENDING" | "APPROVED" | "REJECTED"
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

            {form.watch("status") === "REJECTED" && (
              <div className="space-y-2">
                <Typography variant="Regular_H6">Reason *</Typography>
                <Textarea
                  {...form.register("reason")}
                  placeholder="Enter reason for rejection..."
                  rows={4}
                  className="resize-none"
                />
                {form.formState.errors.reason && (
                  <Typography variant="Regular_H7" className="text-red-500">
                    {form.formState.errors.reason.message}
                  </Typography>
                )}
              </div>
            )}

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
