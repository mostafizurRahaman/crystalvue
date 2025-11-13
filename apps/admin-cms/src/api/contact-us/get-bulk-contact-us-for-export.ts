import axiosInstance from "@/configs/axios";
import { ContactInquiry } from "./types";
import { ApiResponse } from "@/types";

/**
 * Get contact inquiries for bulk export
 */
export async function getBulkContactUsForExport(
  ids: string[]
): Promise<ContactInquiry[]> {
  const response = await axiosInstance.get<ApiResponse<ContactInquiry[]>>(
    `/contact-us/get-bulk-for-export?ids=${ids}`
  );

  return response.data.data || [];
}
