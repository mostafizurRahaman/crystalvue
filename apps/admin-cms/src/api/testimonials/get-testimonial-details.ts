import axiosInstance, { ApiErrorResponse, ApiResponse } from "@/configs/axios";
import { AxiosError } from "axios";
import { TestimonialResponse } from "@/types";

export const getTestimonialDetails = async (
  id: string,
  options: { includeInactive?: boolean } = {}
): Promise<TestimonialResponse> => {
  try {
    const { includeInactive = false } = options;

    const queryParams = new URLSearchParams();
    if (includeInactive) {
      queryParams.append("includeInactive", "true");
    }

    const url = `/testimonials/${id}${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
    const res = await axiosInstance.get<TestimonialResponse>(url);

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
      throw new Error("Failed to fetch testimonial details");
    }
  }
};
