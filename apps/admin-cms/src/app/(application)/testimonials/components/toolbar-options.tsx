"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/typography";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreateTestimonialModal } from "./actions/create-testimonial-popup";
import { BulkDeleteModal } from "./actions/bulk-delete-testimonials";
import { PlusIcon, Trash2, Star } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

interface ToolbarOptionsProps {
  selectedTestimonials: Array<{ id: string; name: string }>;
  totalSelectedCount: number;
  resetSelection: () => void;
}

export function ToolbarOptions({
  selectedTestimonials,
  totalSelectedCount,
  resetSelection,
}: ToolbarOptionsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [bulkDeleteModalOpen, setBulkDeleteModalOpen] = useState(false);
  const [ratingFilter, setRatingFilter] = useState<string>("all");

  // Initialize rating filter from URL params
  useEffect(() => {
    const urlRating = searchParams.get("rating");
    if (urlRating) {
      setRatingFilter(urlRating);
    }
  }, [searchParams]);

  const handleRatingChange = (value: string) => {
    setRatingFilter(value);

    // Update URL search params
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") {
      params.delete("rating");
    } else {
      params.set("rating", value);
    }

    // Update URL without causing a page reload
    const newUrl = params.toString()
      ? `?${params.toString()}`
      : window.location.pathname;
    router.push(newUrl, { scroll: false });
  };

  const handleBulkDelete = () => {
    setBulkDeleteModalOpen(true);
  };

  return (
    <div className="flex items-center justify-between  gap-5">
      <div className="flex items-center space-x-2">
        {totalSelectedCount > 0 && (
          <Typography variant="Regular_H6">
            ({totalSelectedCount} selected)
          </Typography>
        )}
      </div>

      <div className="flex items-center space-x-4">
        {/* Rating Filter */}
        <Select value={ratingFilter} onValueChange={handleRatingChange}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="All Ratings">
              <div className="flex items-center">
                <Star className="w-4 h-4 mr-2" />
                <span>
                  {ratingFilter === "all" ? "All" : `${ratingFilter} Star`}
                </span>
              </div>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Ratings</SelectItem>
            <SelectItem value="5">5 Stars</SelectItem>
            <SelectItem value="4">4 Stars</SelectItem>
            <SelectItem value="3">3 Stars</SelectItem>
            <SelectItem value="2">2 Stars</SelectItem>
            <SelectItem value="1">1 Star</SelectItem>
          </SelectContent>
        </Select>

        {totalSelectedCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleBulkDelete}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Selected ({totalSelectedCount})
          </Button>
        )}

        <Button onClick={() => setCreateModalOpen(true)}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Add Testimonial
        </Button>

        {/* Create Testimonial Modal */}
        <CreateTestimonialModal
          open={createModalOpen}
          onOpenChange={setCreateModalOpen}
          onSuccess={resetSelection}
        />

        {/* Bulk Delete Modal */}
        <BulkDeleteModal
          open={bulkDeleteModalOpen}
          onOpenChange={setBulkDeleteModalOpen}
          testimonials={selectedTestimonials}
          onSuccess={() => {
            setBulkDeleteModalOpen(false);
            resetSelection();
          }}
        />
      </div>
    </div>
  );
}
