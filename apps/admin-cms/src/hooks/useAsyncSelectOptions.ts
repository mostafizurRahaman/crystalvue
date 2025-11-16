"use client";

import { useCallback } from "react";
import { SelectOption } from "@/components/async-searchable-select";
import { getAllCategories } from "@/api/categories";
import { useQueryClient } from "@tanstack/react-query";

/**
 * Generic hook for creating fetch options functions
 */
export function useAsyncSelectOptions() {
  const queryClient = useQueryClient();

  /**
   * Create a fetch function for categories
   */
  const createCategoriesOptions = useCallback((additionalOptions?: {
    pageSize?: number;
    additionalFilters?: Record<string, any>;
  }) => {
    return async (search?: string): Promise<SelectOption[] | { data: SelectOption[]; success: boolean }> => {
      try {
        const response = await getAllCategories({
          page: 1,
          limit: additionalOptions?.pageSize || 50,
          search: search?.trim(),
          ...additionalOptions?.additionalFilters,
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
    };
  }, []);

  // Add more generic option creators here as needed
  const createGenericOptions = useCallback(<T extends Record<string, any>>(
    apiCall: (params: any) => Promise<{ success: boolean; data: T[] }>,
    valueKey: string = "id",
    labelKey: string = "name",
    defaultParams: Record<string, any> = {}
  ) => {
    return async (search?: string): Promise<SelectOption[] | { data: SelectOption[]; success: boolean }> => {
      try {
        const response = await apiCall({
          page: 1,
          limit: 50,
          search: search?.trim(),
          ...defaultParams,
        });
        
        if (response.success && Array.isArray(response.data)) {
          return {
            data: response.data.map((item) => ({
              value: item[valueKey],
              label: item[labelKey] || `Option ${item[valueKey]}`,
            })),
            success: true,
          };
        }
        
        return { data: [], success: false };
      } catch (error) {
        console.error("Failed to fetch options:", error);
        return { data: [], success: false };
      }
    };
  }, []);

  return {
    createCategoriesOptions,
    createGenericOptions,
  };
}
