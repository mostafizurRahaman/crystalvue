import axiosInstance from "@/configs/axios";
import { ContactInquiry } from "./types";

/**
 * Get contact inquiries for bulk export
 */
export async function getBulkContactUsForExport(
  params: {
    status?: string;
    from_date?: string;
    to_date?: string;
  } = {}
): Promise<ContactInquiry[]> {
  const { status, from_date, to_date } = params;

  const queryParams = new URLSearchParams();
  if (status) queryParams.append("status", status);
  if (from_date) queryParams.append("from_date", from_date);
  if (to_date) queryParams.append("to_date", to_date);

  const response = await axiosInstance.get<ContactInquiry[]>(
    `/contact-us/get-bulk-for-export?${queryParams.toString()}`
  );
  return response.data || [];
}
