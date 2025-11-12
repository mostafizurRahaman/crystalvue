import { formatDateOnly } from "@/lib/format-date";
import { ContactUsExportData } from "../index";
import { useMemo } from "react";

export function useExportConfig() {
  // Column mapping for export
  const columnMapping = useMemo(() => {
    return {
      id: "ID",
      name: "Name",
      email: "Email",
      phone: "Phone",
      subject: "Subject",
      message: "Message",
      status: "Status",
      images: "Images",
      createdAt: "Created Date",
      updatedAt: "Updated Date",
    };
  }, []);

  // Column widths for Excel export
  const columnWidths = useMemo(() => {
    return [
      { wch: 10 }, // ID
      { wch: 25 }, // Name
      { wch: 30 }, // Email
      { wch: 20 }, // Phone
      { wch: 35 }, // Subject
      { wch: 50 }, // Message
      { wch: 15 }, // Status
      { wch: 20 }, // Created Date
      { wch: 20 }, // Updated Date
    ];
  }, []);

  // Headers for CSV export
  const headers = useMemo(() => {
    return [
      "id",
      "name",
      "email",
      "phone",
      "subject",
      "message",
      "status",
      "images",
      "createdAt",
      "updatedAt",
    ];
  }, []);

  // Transform function for export data formatting
  const transformData = useMemo(() => {
    return (data: ContactUsExportData) => {
      return {
        id: data.id,
        name: data.name,
        email: data.email,
        phone: data.phone || "",
        subject: data.subject,
        message: data.message,
        status: data.status,
        images: data.images ? data.images.join(", ") : "",
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
    entityName: "contact-us", // Used for filename
    transformFunction: transformData,
  };
}
