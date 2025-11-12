import axiosInstance from "@/configs/axios";
import { ContactUsResponse, GetAllContactUsRequest } from "./types";

/**
 * Get all contact inquiries with filtering, sorting, and pagination
 */
export async function getAllContactUs(
  params: GetAllContactUsRequest = {}
): Promise<ContactUsResponse> {
  const {
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortOrder = "desc",
    from_date,
    to_date,
    status,
  } = params;

  const queryParams = new URLSearchParams();
  queryParams.append("page", page.toString());
  queryParams.append("limit", limit.toString());
  queryParams.append("sortBy", sortBy);
  queryParams.append("sortOrder", sortOrder);

  if (from_date) queryParams.append("from_date", from_date);
  if (to_date) queryParams.append("to_date", to_date);
  if (status) queryParams.append("status", status);

  const response = await axiosInstance.get<ContactUsResponse>(
    `/contact-us/get-all?${queryParams.toString()}`
  );
  return response.data;
}
