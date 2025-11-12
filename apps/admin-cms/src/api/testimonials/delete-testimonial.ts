import axiosInstance, { ApiErrorResponse, ApiResponse } from "@/configs/axios";
import { AxiosError } from "axios";
import { DeleteTestimonialResponse } from "@/types";

export const deleteTestimonial = async (
  id: string
): Promise<ApiResponse<DeleteTestimonialResponse["data"]>> => {
  try {
    const res = await axiosInstance.delete<ApiResponse<DeleteTestimonialResponse["data"]>>(
      `/testimonials/${id}`
    );

    if (!res.data.data) {
      throw new Error("Testimonial deletion response not found");
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
      throw new Error("Failed to delete testimonial");
    }
  }
};
