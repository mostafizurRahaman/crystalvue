"use client";

import * as React from "react";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
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
import { Testimonial, TestimonialExportData } from "@/types";
import { EditTestimonialModal } from "./actions/edit-testimonial-popup";
import { DeleteTestimonialModal } from "./actions/delete-testimonial-popup";
import { ImageMetadata } from "@/schemas/sliders";
import { Typography } from "@/components/typography";

interface DataTableRowActionsProps<TData> {
  row: {
    original: TData;
    id: string;
  };
}

export function DataTableRowActions<TData extends TestimonialExportData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const queryClient = useQueryClient();
  const router = useRouter();

  // Convert TestimonialExportData back to Testimonial for the edit modal
  const testimonialData: Partial<Testimonial> = {
    id: row.original.id,
    name: row.original.name,
    message: row.original.message,
    rating: row.original.rating,
    position: row.original.position!,
    company: row.original.company!,
    isActive: row.original.isActive,
    createdAt: new Date(row.original.createdAt),
    updatedAt: new Date(row.original.updatedAt),
    image: row.original.image as ImageMetadata,
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
            <Typography variant="Regular_H6">Actions</Typography>
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
            onClick={() => setDeleteModalOpen(true)}
            className="text-red-600 hover:text-red-700 cursor-pointer"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Edit Modal */}
      <EditTestimonialModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        testimonial={testimonialData as Testimonial}
        onSuccess={() => {
          router.refresh();
          queryClient.invalidateQueries({ queryKey: ["testimonials"] });
        }}
      />

      {/* Delete Modal */}
      <DeleteTestimonialModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        testimonial={testimonialData}
        onSuccess={() => {
          router.refresh();
          queryClient.invalidateQueries({ queryKey: ["testimonials"] });
        }}
      />
    </>
  );
}
