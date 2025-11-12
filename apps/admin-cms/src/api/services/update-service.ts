import axiosInstance, { ApiErrorResponse } from "@/configs/axios";
import { AxiosError } from "axios";
import { UpdateServiceRequest, Service, ApiResponse } from "@/types";

export const updateService = async (
  id: string,
  data: UpdateServiceRequest
): Promise<ApiResponse<Service>> => {
  try {
    const res = await axiosInstance.put<ApiResponse<Service>>(
      `/services/${id}`,
      data
    );

    if (!res.data) {
      throw new Error("Service data not found");
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
      throw new Error("Failed to update service");
    }
  }
};
