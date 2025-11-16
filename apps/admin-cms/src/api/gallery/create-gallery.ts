import axiosInstance, { ApiErrorResponse } from "@/configs/axios";
import { AxiosError } from "axios";
import { ApiResponse, CreateGalleryRequest, Gallery } from "@/types";

export const createGallery = async (
  data: CreateGalleryRequest
): Promise<ApiResponse<Gallery>> => {
  try {
    const res = await axiosInstance.post<ApiResponse<Gallery>>(
      "/gallery",
      data
    );

    if (!res.data) {
      throw new Error("Gallery data not found");
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
      throw new Error("Failed to create gallery");
    }
  }
};
