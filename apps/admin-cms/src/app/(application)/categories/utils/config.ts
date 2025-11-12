import { formatDateOnly } from "@/lib/format-date";
import { CategoryExportData } from "@/types";
import { useMemo } from "react";

export function useExportConfig() {
  // Column mapping for export
  const columnMapping = useMemo(() => {
    return {
      id: "ID",
      name: "Name",
      tagline: "Tagline",
      description: "Description",
      isActive: "Status",
      isPremium: "Premium",
      isRepairingService: "Repair Service",
      isShowHome: "Show on Home",
      sortOrder: "Sort Order",
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
      { wch: 12 }, // Status
      { wch: 12 }, // Premium
      { wch: 15 }, // Repair Service
      { wch: 15 }, // Show on Home
      { wch: 12 }, // Sort Order
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
      "isActive",
      "isPremium",
      "isRepairingService",
      "isShowHome",
      "sortOrder",
      "createdAt",
      "updatedAt",
    ];
  }, []);

  // Transform function for export data formatting
  const transformData = useMemo(() => {
    return (data: CategoryExportData) => {
      return {
        id: data.id,
        name: data.name,
        tagline: data.tagline || "",
        description: data.description || "",
        isActive: data.isActive ? "Active" : "Inactive",
        isPremium: data.isPremium ? "Yes" : "No",
        isRepairingService: data.isRepairingService ? "Yes" : "No",
        isShowHome: data.isShowHome ? "Yes" : "No",
        sortOrder: data.sortOrder || 0,
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
    entityName: "categories", // Used for filename
    transformFunction: transformData,
  };
}
