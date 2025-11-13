"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface BulkDeletePopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedCategories: { id: string; name: string }[];
  allSelectedIds: string[];
  totalSelectedCount: number;
  resetSelection: () => void;
}

export function BulkDeletePopup({
  open,
  onOpenChange,
  selectedCategories,
  allSelectedIds,
  totalSelectedCount,
  resetSelection,
}: BulkDeletePopupProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleBulkDelete = async () => {
    try {
      setIsLoading(true);

      // Delete categories one by one (since we don't have a bulk delete endpoint)
      const deletePromises = allSelectedIds.map(async (id) => {
        try {
          const response = await fetch(
            `/api/categories/${id}?softDelete=true`,
            {
              method: "DELETE",
            }
          );

          if (!response.ok) {
            throw new Error(`Failed to delete category ${id}`);
          }

          return { id, success: true };
        } catch (error) {
          console.error(`Error deleting category ${id}:`, error);
          return { id, success: false, error };
        }
      });

      const results = await Promise.all(deletePromises);
      const successful = results.filter((r) => r.success);
      const failed = results.filter((r) => !r.success);

      if (successful.length > 0) {
        toast.success(`${successful.length} categories deleted successfully`);
      }

      if (failed.length > 0) {
        toast.error(`Failed to delete ${failed.length} categories`);
      }

      onOpenChange(false);
      resetSelection();

      // Refresh data
      router.refresh();
      await queryClient.invalidateQueries({ queryKey: ["categories"] });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete categories"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Delete Categories?
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Are you sure you want to delete {totalSelectedCount} categories?
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleBulkDelete}
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? "Deleting..." : `Delete ${totalSelectedCount}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
