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
    search,
    from_date,
    to_date,
    status,
  } = params;

  const queryParams = new URLSearchParams();
  queryParams.append("page", page.toString());
  queryParams.append("limit", limit.toString());
  queryParams.append("sortBy", sortBy);
  queryParams.append("sortOrder", sortOrder);

  if (search) queryParams.append("search", search);
  if (from_date) queryParams.append("startDate", from_date);
  if (to_date) queryParams.append("endDate", to_date);
  if (status) queryParams.append("status", status);

  const response = await axiosInstance.get<{
    success: boolean;
    message: string;
    data: ContactUsResponse["data"];
    pagination: {
      page: number;
      limit: number;
      total_items: number;
      total_pages: number;
    };
  }>(`/contact-us/get-all?${queryParams.toString()}`);

  // Transform backend response to match frontend types
  return {
    success: response.data.success,
    message: response.data.message,
    data: response.data.data,
    pagination: {
      currentPage: response.data.pagination.page,
      totalPages: response.data.pagination.total_pages,
      totalItems: response.data.pagination.total_items,
      limit: response.data.pagination.limit,
    },
  };
}
