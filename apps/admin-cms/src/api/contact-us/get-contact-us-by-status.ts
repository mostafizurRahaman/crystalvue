import axiosInstance from "@/configs/axios";
import { ContactUsResponse } from "./types";

/**
 * Get contact inquiries filtered by status
 */
export async function getContactUsByStatus(
  status: string,
  params: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  } = {}
): Promise<ContactUsResponse> {
  const {
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = params;

  const queryParams = new URLSearchParams();
  queryParams.append("page", page.toString());
  queryParams.append("limit", limit.toString());
  queryParams.append("sortBy", sortBy);
  queryParams.append("sortOrder", sortOrder);

  const response = await axiosInstance.get<ContactUsResponse>(
    `/contact-us/status/${status}?${queryParams.toString()}`
  );
  return response.data;
}
