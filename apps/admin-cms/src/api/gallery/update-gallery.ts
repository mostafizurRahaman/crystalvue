import axiosInstance, { ApiErrorResponse } from "@/configs/axios";
import { AxiosError } from "axios";
import { ApiResponse, UpdateGalleryRequest, Gallery } from "@/types";

/**
 * Update gallery by ID
 */
export const updateGallery = async (
  id: string,
  data: UpdateGalleryRequest
): Promise<ApiResponse<Gallery>> => {
  try {
    const res = await axiosInstance.put<ApiResponse<Gallery>>(
      `/gallery/${id}`,
      data
    );

    if (!res.data) {
      throw new Error("Gallery update response not found");
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
      throw new Error("Failed to update gallery");
    }
  }
};
