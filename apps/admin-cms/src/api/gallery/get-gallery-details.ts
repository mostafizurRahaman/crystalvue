import axiosInstance, { ApiErrorResponse } from "@/configs/axios";
import { AxiosError } from "axios";
import { GalleryResponse, GetGalleryDetailsRequest } from "@/types";

/**
 * Get gallery details by ID
 */
export const getGalleryDetails = async (
  id: string
): Promise<GalleryResponse> => {
  try {
    const res = await axiosInstance.get<GalleryResponse>(`/gallery/${id}`);

    if (!res.data) {
      throw new Error("Gallery details not found");
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
      throw new Error("Failed to get gallery details");
    }
  }
};
