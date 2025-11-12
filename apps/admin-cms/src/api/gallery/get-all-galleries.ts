import axiosInstance, { ApiErrorResponse } from "@/configs/axios";
import { AxiosError } from "axios";
import { GalleriesResponse, GetAllGalleriesRequest } from "@/types";

/**
 * Get all galleries with filtering, sorting, and pagination
 */
export async function getAllGalleries(
  params: GetAllGalleriesRequest = {}
): Promise<GalleriesResponse> {
  const {
    page = 1,
    limit = 10,
    galleryCategory,
    search,
    isActive = undefined,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = params;

  try {
    const queryParams = new URLSearchParams();
    queryParams.append("page", page.toString());
    queryParams.append("limit", limit.toString());

    if (galleryCategory) queryParams.append("galleryCategory", galleryCategory);
    if (search) queryParams.append("search", search);
    if (isActive !== undefined)
      queryParams.append("isActive", isActive.toString());
    queryParams.append("sortBy", sortBy);
    queryParams.append("sortOrder", sortOrder);

    const response = await axiosInstance.get<GalleriesResponse>(
      `/gallery?${queryParams.toString()}`
    );
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ApiErrorResponse>;

    if (axiosError.response?.data) {
      const errorData = axiosError.response.data;
      throw new Error(errorData.message);
    } else if (axiosError.message) {
      throw new Error(axiosError.message);
    } else {
      throw new Error("Failed to get all galleries");
    }
  }
}
