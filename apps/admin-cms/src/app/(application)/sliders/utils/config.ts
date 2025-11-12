import { useMemo } from "react";

// ✅ Flattened exportable slider type
export interface ExportableSlider {
  id: number;
  title: string;
  subtitle: string | null;
  buttonText: string | null;
  buttonUrl: string | null;
  isActive: boolean;
  orderNumber: number;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export function useExportConfig() {
  const columnMapping = useMemo(() => {
    return {
      id: "ID",
      title: "Title",
      subtitle: "Subtitle",
      isActive: "Status",
      orderNumber: "Order",
      imageUrl: "Image URL",
      buttonText: "Button Text",
      buttonUrl: "Button URL",
      createdAt: "Created At",
      updatedAt: "Updated At",
    };
  }, []);

  const columnWidths = useMemo(() => {
    return [
      { wch: 10 }, // ID
      { wch: 30 }, // Title
      { wch: 40 }, // Subtitle
      { wch: 10 }, // Status
      { wch: 10 }, // Order
      { wch: 40 }, // Image URL
      { wch: 20 }, // Button Text
      { wch: 30 }, // Button URL
      { wch: 20 }, // Created At
      { wch: 20 }, // Updated At
    ];
  }, []);

  const headers = useMemo(() => {
    return [
      "id",
      "title",
      "subtitle",
      "isActive",
      "orderNumber",
      "imageUrl",
      "buttonText",
      "buttonUrl",
      "createdAt",
      "updatedAt",
    ];
  }, []);

  return {
    columnMapping,
    columnWidths,
    headers,
    entityName: "sliders",
  };
}
