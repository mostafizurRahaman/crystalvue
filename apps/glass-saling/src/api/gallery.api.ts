import axiosInstance from "@/configs/axios";
import { GetAllGalleriesResponse, GetAllGalleriesParams } from "./types";

/**
 * Get all galleries with pagination, filtering, and sorting
 * Matches the backend API structure at /gallery
 */
export const getAllGalleries = async (
  params?: GetAllGalleriesParams
): Promise<GetAllGalleriesResponse> => {
  const searchParams = new URLSearchParams();

  if (params) {
    if (params.page) searchParams.append("page", params.page.toString());
    if (params.limit) searchParams.append("limit", params.limit.toString());
    if (params.sortBy) searchParams.append("sortBy", params.sortBy);
    if (params.sortOrder) searchParams.append("sortOrder", params.sortOrder);
    if (params.galleryCategory)
      searchParams.append("galleryCategory", params.galleryCategory);
    if (params.isActive !== undefined)
      searchParams.append("isActive", params.isActive.toString());
    if (params.search) searchParams.append("search", params.search);
  }

  const url = searchParams.toString()
    ? `/gallery?${searchParams.toString()}`
    : "/gallery";

  const response = await axiosInstance.get<GetAllGalleriesResponse>(url);
  return response.data;
};
