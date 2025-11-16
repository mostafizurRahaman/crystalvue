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
import { deleteTestimonial } from "@/api/testimonials";
import { Star } from "lucide-react";
import { Testimonial } from "@/types";

interface DeleteTestimonialModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  testimonial: Partial<Testimonial>;
  onSuccess?: () => void;
}

export function DeleteTestimonialModal({
  open,
  onOpenChange,
  testimonial,
  onSuccess,
}: DeleteTestimonialModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!testimonial.id) {
      toast.error("Testimonial ID is missing");
      return;
    }

    setIsDeleting(true);
    try {
      await deleteTestimonial(testimonial.id.toString());
      toast.success(
        `Successfully deleted testimonial: ${testimonial.name || "Unknown"}`
      );
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error("Delete testimonial error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to delete testimonial"
      );
    } finally {
      setIsDeleting(false);
    }
  };

  // Render star rating
  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            <Typography variant="Bold_H4">Delete Testimonial</Typography>
          </DialogTitle>
          <DialogDescription>
            <Typography variant="Regular_H6">
              Are you sure you want to delete &ldquo;
              {testimonial.name || "this testimonial"}&rdquo;? This action
              cannot be undone.
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
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
