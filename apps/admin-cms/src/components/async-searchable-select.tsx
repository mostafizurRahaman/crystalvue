/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export interface SelectOption {
  value: string;
  label: string;
}

// Generic function type for fetching options
type FetchOptionsFunction<T> = (
  searchQuery?: string
) => Promise<SelectOption[] | { data: SelectOption[]; success: boolean }>;

interface AsyncSearchableSelectProps {
  placeholder?: string;
  searchPlaceholder?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  className?: string;
  // New props for dynamic API usage
  fetchOptions?: FetchOptionsFunction<any>;
  // Legacy props for backward compatibility
  apiEndpoint?: string;
  // Additional options
  pageSize?: number;
  debounceMs?: number;
  enableInitialLoad?: boolean;
}

// Helper function to handle different response formats
const mapToSelectOptions = (
  data: any,
  valueKey: string = "id",
  labelKey: string = "name"
): SelectOption[] => {
  if (Array.isArray(data)) {
    return data.map((item) => ({
      value: item[valueKey] || item.id,
      label:
        item[labelKey] || item.name || `Option ${item[valueKey] || item.id}`,
    }));
  }
  return [];
};

export function AsyncSearchableSelect({
  placeholder = "Select an option...",
  searchPlaceholder = "Search...",
  value,
  onValueChange,
  disabled = false,
  className,
  fetchOptions,
  apiEndpoint, // for backward compatibility
  pageSize = 50,
  debounceMs = 300,
  enableInitialLoad = true,
}: AsyncSearchableSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState<SelectOption[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  // Default fetch function using axiosInstance if custom function not provided
  const defaultFetchOptions = React.useCallback(
    async (search?: string) => {
      if (!apiEndpoint) {
        console.warn("No fetchOptions function or apiEndpoint provided");
        return { data: [], success: true };
      }

      try {
        const axiosInstance = (await import("@/configs/axios")).default;
        const params = new URLSearchParams();
        params.append("limit", pageSize.toString());
        if (search && search.trim()) {
          params.append("search", search.trim());
        }

        const response = await axiosInstance.get(
          `${apiEndpoint}?${params.toString()}`
        );
        return {
          data: mapToSelectOptions(response.data?.data || []),
          success: response.data?.success ?? true,
        };
      } catch (error) {
        console.error("Failed to fetch options:", error);
        throw new Error(
          error instanceof Error ? error.message : "Failed to fetch options"
        );
      }
    },
    [apiEndpoint, pageSize]
  );

  // Memoized fetch function
  const fetchOptionsMemoized = React.useMemo(() => {
    return fetchOptions || defaultFetchOptions;
  }, [fetchOptions, defaultFetchOptions]);

  // Initial load when component mounts if enabled
  React.useEffect(() => {
    if (enableInitialLoad && !open) {
      const loadInitialOptions = async () => {
        setLoading(true);
        setError(null);
        try {
          const result = await fetchOptionsMemoized();
          if (Array.isArray(result)) {
            setOptions(result);
          } else if (result.success && Array.isArray(result.data)) {
            setOptions(result.data);
          } else {
            setOptions([]);
          }
        } catch (err) {
          setError(
            err instanceof Error ? err.message : "Failed to load options"
          );
          setOptions([]);
        } finally {
          setLoading(false);
        }
      };
      loadInitialOptions();
    }
  }, [enableInitialLoad, fetchOptionsMemoized, open]);

  // Fetch options when search query changes or when popover opens
  React.useEffect(() => {
    if (!open) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchOptionsMemoized(searchQuery);

        if (Array.isArray(result)) {
          setOptions(result);
        } else if (result.success && Array.isArray(result.data)) {
          setOptions(result.data);
        } else {
          setOptions([]);
          setError("No data available");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        setOptions([]);
      } finally {
        setLoading(false);
      }
    };

    // Debounce the fetch request
    const timer = setTimeout(fetchData, debounceMs);
    return () => clearTimeout(timer);
  }, [open, searchQuery, fetchOptionsMemoized, debounceMs]);

  const selectedLabel = React.useMemo(() => {
    return options.find((opt) => opt.value === value)?.label || value;
  }, [options, value]);

  const handleSelect = React.useCallback(
    (currentValue: string) => {
      const newValue = currentValue === value ? "" : currentValue;
      onValueChange?.(newValue);
      setOpen(false);
      setSearchQuery("");
    },
    [value, onValueChange]
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
          disabled={disabled}
        >
          <span className="truncate text-left">
            {selectedLabel || placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-0"
        align="start"
      >
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={searchPlaceholder}
            value={searchQuery}
            onValueChange={setSearchQuery}
            disabled={loading}
          />
          <CommandList>
            {loading && (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                <span className="ml-2 text-sm text-muted-foreground">
                  Loading...
                </span>
              </div>
            )}
            {error && !loading && (
              <CommandEmpty className="text-destructive">{error}</CommandEmpty>
            )}
            {!loading && options.length === 0 && !error && (
              <CommandEmpty>No options found.</CommandEmpty>
            )}
            {!loading && options.length > 0 && (
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={() => handleSelect(option.value)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === option.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
