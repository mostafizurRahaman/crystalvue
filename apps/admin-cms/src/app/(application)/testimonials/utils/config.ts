"use client";

import { formatDateOnly } from "@/lib/format-date";
import { TestimonialExportData } from "@/types";
import { useMemo } from "react";

export function useExportConfig() {
  // Column mapping for export
  const columnMapping = useMemo(() => {
    return {
      id: "ID",
      name: "Name",
      message: "Message",
      rating: "Rating",
      position: "Position",
      company: "Company",
      isActive: "Status",
      createdAt: "Created Date",
      updatedAt: "Updated Date",
    };
  }, []);

  // Column widths for Excel export
  const columnWidths = useMemo(() => {
    return [
      { wch: 10 }, // ID
      { wch: 25 }, // Name
      { wch: 50 }, // Message
      { wch: 10 }, // Rating  
      { wch: 20 }, // Position
      { wch: 25 }, // Company
      { wch: 12 }, // Status
      { wch: 20 }, // Created Date
      { wch: 20 }, // Updated Date
    ];
  }, []);

  // Headers for CSV export
  const headers = useMemo(() => {
    return [
      "id",
      "name",
      "message",
      "rating",
      "position",
      "company",
      "isActive",
      "createdAt",
      "updatedAt",
    ];
  }, []);

  // Transform function for export data formatting
  const transformData = useMemo(() => {
    return (data: TestimonialExportData) => {
      return {
        id: data.id,
        name: data.name,
        message: data.message || "",
        rating: data.rating,
        position: data.position || "",
        company: data.company || "",
        isActive: data.isActive ? "Active" : "Inactive",
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
    entityName: "testimonials", // Used for filename
    transformFunction: transformData,
  };
}
