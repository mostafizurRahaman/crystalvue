import axiosInstance, { ApiErrorResponse } from "@/configs/axios";
import { AxiosError } from "axios";
import {
  GalleryBulkExportResponse,
  GetGalleriesForBulkExportRequest,
  GalleriesResponse,
  Gallery,
} from "@/types";
import { toast } from "sonner";

/**
 * Get galleries for bulk export with optional filtering
 */
export async function getGalleriesForBulkExport(
  params: GetGalleriesForBulkExportRequest = {}
): Promise<GalleryBulkExportResponse> {
  const { ids, galleryCategory, isActive, limit = 100 } = params;

  if (!ids || ids.length === 0) {
    toast.error("No galleries selected for export");
    return {
      success: false,
      message: "No galleries selected",
      data: [],
    };
  }

  try {
    // First try the dedicated bulk export endpoint
    try {
      const queryParams = new URLSearchParams();
      queryParams.append("ids", ids.join(","));

      if (galleryCategory)
        queryParams.append("galleryCategory", galleryCategory);
      if (isActive !== undefined)
        queryParams.append("isActive", isActive.toString());
      queryParams.append("limit", limit.toString());

      const response = await axiosInstance.get<GalleryBulkExportResponse>(
        `/gallery/bulk/export?${queryParams.toString()}`
      );

      return response.data;
    } catch (bulkExportError) {
      // If bulk export doesn't exist, fallback to regular getAllGalleries
      console.warn(
        "Bulk export endpoint not found, falling back to regular API"
      );

      const queryParams = new URLSearchParams();
      queryParams.append("page", "1");
      queryParams.append("limit", ids.length.toString());

      if (galleryCategory)
        queryParams.append("galleryCategory", galleryCategory);
      if (isActive !== undefined)
        queryParams.append("isActive", isActive.toString());

      const response = await axiosInstance.get<GalleriesResponse>(
        `/gallery?${queryParams.toString()}`
      );

      // Filter by selected IDs if needed
      const filteredData = response.data.data.filter(
        (gallery: Gallery) => ids.includes(gallery.id)
      );

      return {
        success: true,
        message: "Galleries exported successfully",
        data: filteredData,
        summary: {
          total: filteredData.length,
          exportedAt: new Date().toISOString(),
        },
      };
    }
  } catch (error) {
    const axiosError = error as AxiosError<ApiErrorResponse>;

    if (axiosError.response?.data) {
      const errorData = axiosError.response.data;
      toast.error(errorData.message);
      throw new Error(errorData.message);
    } else if (axiosError.message) {
      toast.error(axiosError.message);
      throw new Error(axiosError.message);
    } else {
      toast.error("Failed to export galleries");
      throw new Error("Failed to export galleries");
    }
  }
}
