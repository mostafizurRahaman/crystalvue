import { formatDateOnly } from "@/lib/format-date";
import { ServiceExportData } from "@/types";
import { useMemo } from "react";

export function useExportConfig() {
  // Column mapping for export
  const columnMapping = useMemo(() => {
    return {
      id: "ID",
      name: "Name",
      tagline: "Tagline",
      description: "Description",
      price: "Price",
      isActive: "Status",
      isPremium: "Premium",
      sortOrder: "Sort Order",
      parentCategoryId: "Category ID",
      createdAt: "Created Date",
      updatedAt: "Updated Date",
    };
  }, []);

  // Column widths for Excel export
  const columnWidths = useMemo(() => {
    return [
      { wch: 10 }, // ID
      { wch: 25 }, // Name
      { wch: 30 }, // Tagline
      { wch: 40 }, // Description
      { wch: 15 }, // Price
      { wch: 12 }, // Status
      { wch: 12 }, // Premium
      { wch: 12 }, // Sort Order
      { wch: 20 }, // Category ID
      { wch: 20 }, // Created Date
      { wch: 20 }, // Updated Date
    ];
  }, []);

  // Headers for CSV export
  const headers = useMemo(() => {
    return [
      "id",
      "name",
      "tagline",
      "description",
      "price",
      "isActive",
      "isPremium",
      "sortOrder",
      "parentCategoryId",
      "createdAt",
      "updatedAt",
    ];
  }, []);

  // Transform function for export data formatting
  const transformData = useMemo(() => {
    return (data: ServiceExportData) => {
      return {
        id: data.id,
        name: data.name,
        tagline: data.tagline || "",
        description: data.description || "",
        price: data.price || 0,
        isActive: data.isActive ? "Active" : "Inactive",
        isPremium: data.isPremium ? "Yes" : "No",
        sortOrder: data.sortOrder || 0,
        parentCategoryId: data.parentCategoryId || "",
        createdAt: data.createdAt
          ? formatDateOnly(new Date(data.createdAt))
          : "",
        updatedAt: data.updatedAt
          ? formatDateOnly(new Date(data.updatedAt))
          : "",
      };
    };
  }, []);

  return {
    columnMapping,
    columnWidths,
    headers,
    entityName: "services", // Used for filename
    transformFunction: transformData,
  };
}
