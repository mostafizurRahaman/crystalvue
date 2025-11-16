import axiosInstance, { ApiErrorResponse } from "@/configs/axios";
import { AxiosError } from "axios";
import { ApiResponse, DeleteGalleryResponse } from "@/types";

/**
 * Delete gallery by ID
 */
export const deleteGallery = async (
  id: string
): Promise<ApiResponse<DeleteGalleryResponse["data"]>> => {
  try {
    const res = await axiosInstance.delete<
      ApiResponse<DeleteGalleryResponse["data"]>
    >(`/gallery/${id}`);

    if (!res.data) {
      throw new Error("Gallery deletion response not found");
    }
    return res.data;
  } catch (error) {
    const axiosError = error as AxiosError<ApiErrorResponse>;

    if (axiosError.response?.data) {
      const errorData = axiosError.response.data;
      throw new Error(errorData.message);
    } else if (axiosError.message) {
      throw new Error(axiosError.message);
    } else {
      throw new Error("Failed to delete gallery");
    }
  }
};
