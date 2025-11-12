"use client";

import * as React from "react";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Service, ServiceExportData } from "@/types";
import { deleteService } from "@/api/services";
import { EditServiceModal } from "./actions/edit-service-popup";
import { DeleteServiceModal } from "./actions/delete-service-popup";

interface DataTableRowActionsProps<TData> {
  row: {
    original: TData;
    id: string;
  };
  table: {
    getIsAllPageRowsSelected: () => boolean;
    getIsSomePageRowsSelected: () => boolean;
    toggleAllPageRowsSelected: (value: boolean) => void;
  };
}

export function DataTableRowActions<TData extends ServiceExportData>({
  row,
  table,
}: DataTableRowActionsProps<TData>) {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const queryClient = useQueryClient();
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteService(row.id);
      toast.success("Service deleted successfully");
      setDeleteModalOpen(false);

      // Refresh data
      router.refresh();
      await queryClient.invalidateQueries({ queryKey: ["services"] });
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to delete service"
      );
    } finally {
      setIsDeleting(false);
    }
  };

  // Convert ServiceExportData back to Service for the edit modal
  const serviceData: Service = {
    id: row.original.id,
    name: row.original.name,
    tagline: row.original.tagline!,
    description: row.original.description || "",
    price: row.original.price,
    isPremium: row.original.isPremium,
    image: row.original.image!,
    isActive: row.original.isActive,
    parentCategoryId: row.original.parentCategoryId,
    createdAt: new Date(row.original.createdAt),
    updatedAt: new Date(row.original.updatedAt),
    serviceAddons: row.original.serviceAddons,
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>
            <p className="text-sm font-medium">Actions</p>
          </DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => setEditModalOpen(true)}
            className="cursor-pointer"
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-destructive-600 hover:text-destructive-700 cursor-pointer"
          >
            {isDeleting ? (
              <>Deleting...</>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </>
            )}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Edit Modal */}
      <EditServiceModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        service={serviceData as Service}
        onSuccess={() => {
          router.refresh();
          queryClient.invalidateQueries({ queryKey: ["services"] });
        }}
      />

      {/* Delete Modal */}
      <DeleteServiceModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        service={serviceData as Service}
        onSuccess={() => {
          router.refresh();
          queryClient.invalidateQueries({ queryKey: ["services"] });
        }}
      />
    </>
  );
}
