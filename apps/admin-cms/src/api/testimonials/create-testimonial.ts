import axiosInstance, { ApiErrorResponse, ApiResponse } from "@/configs/axios";
import { AxiosError } from "axios";
import { CreateTestimonialRequest, Testimonial } from "@/types";

export const createTestimonial = async (
  data: CreateTestimonialRequest
): Promise<ApiResponse<Testimonial>> => {
  try {
    const res = await axiosInstance.post<ApiResponse<Testimonial>>(
      "/testimonials",
      data
    );

    if (!res.data.data) {
      throw new Error("Testimonial data not found");
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
      throw new Error("Failed to create testimonial");
    }
  }
};
