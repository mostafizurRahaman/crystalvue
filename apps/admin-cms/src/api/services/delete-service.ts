import axiosInstance, { ApiErrorResponse } from "@/configs/axios";
import { AxiosError } from "axios";
import { ApiResponse, DeleteServiceResponse } from "@/types";

export const deleteService = async (
  id: string
): Promise<ApiResponse<DeleteServiceResponse["data"]>> => {
  try {
    const res = await axiosInstance.delete<
      ApiResponse<DeleteServiceResponse["data"]>
    >(`/services/${id}`);

    if (!res.data) {
      throw new Error("Service deletion response not found");
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
      throw new Error("Failed to delete service");
    }
  }
};
