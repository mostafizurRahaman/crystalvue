"use client";

import { useState, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/typography";
import { AsyncSearchableSelect } from "@/components/async-searchable-select";
import { getAllCategories } from "@/api/categories";

import { PlusIcon, X } from "lucide-react";
import { CreateServiceModal } from "./actions/create-service-popup";

interface ToolbarOptionsProps {
  selectedServices: Array<{ id: string; name: string }>;
  totalSelectedCount: number;
  resetSelection: () => void;
}

export function ToolbarOptions({
  totalSelectedCount,
  resetSelection,
}: ToolbarOptionsProps) {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Get current categoryId from URL search params
  const categoryId = searchParams.get("categoryId") || "";

  // Custom fetch function for categories
  const fetchCategoriesOptions = useCallback(async (search?: string) => {
    try {
      const response = await getAllCategories({
        page: 1,
        limit: 50,
        search: search?.trim(),
        isActive: true,
        sortBy: "name",
        sortOrder: "asc",
      });

      if (response.success && Array.isArray(response.data)) {
        return {
          data: response.data.map((category) => ({
            value: category.id,
            label: category.name,
          })),
          success: true,
        };
      }

      return { data: [], success: false };
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      return { data: [], success: false };
    }
  }, []);

  // Handle category filter change
  const handleCategoryFilterChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set("categoryId", value);
    } else {
      params.delete("categoryId");
    }

    // Reset to first page when filter changes
    params.delete("page");

    router.push(`${pathname}?${params.toString()}`);
  };

  // Clear category filter
  const clearCategoryFilter = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("categoryId");
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center space-x-4">
        {/* Category Filter */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <AsyncSearchableSelect
              placeholder="All Categories"
              searchPlaceholder="Search categories..."
              fetchOptions={fetchCategoriesOptions}
              value={categoryId}
              onValueChange={handleCategoryFilterChange}
              className="w-64"
              pageSize={50}
              debounceMs={300}
              enableInitialLoad={true}
            />
            {categoryId && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearCategoryFilter}
                className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Selected Count */}
        {totalSelectedCount > 0 && (
          <Typography variant="Regular_H6" className="text-foreground">
            ({totalSelectedCount} selected)
          </Typography>
        )}
      </div>

      <div className="flex items-center space-x-4">
        <Button onClick={() => setCreateModalOpen(true)}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Add Service
        </Button>

        {/* Create Service Modal */}
        <CreateServiceModal
          open={createModalOpen}
          onOpenChange={setCreateModalOpen}
          onSuccess={resetSelection}
        />
      </div>
    </div>
  );
}
