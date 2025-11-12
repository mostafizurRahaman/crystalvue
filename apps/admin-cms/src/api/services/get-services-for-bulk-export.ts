import axiosInstance from "@/configs/axios";
import {
  ServicesForExportResponse,
  GetBulkServicesRequest,
  ApiResponse,
  Service,
} from "@/types";
import { toast } from "sonner";

/**
 * Get services for bulk export with optional filtering
 */
export async function getServicesForBulkExport(
  params: GetBulkServicesRequest = {}
): Promise<ApiResponse<Service[]>> {
  const { ids } = params;

  if (!ids || ids.length < 0) {
    toast.error("No services selected");
    return {
      success: false,
      message: "No services selected",
      data: [],
    };
  }
  const response = await axiosInstance.get<ServicesForExportResponse>(
    `/services/bulk/export?ids=${ids.join(",")}`
  );

  return response.data as ApiResponse<Service[]>;
}
