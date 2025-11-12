import axiosInstance, { ApiErrorResponse } from "@/configs/axios";
import { AxiosError } from "axios";
import { ApiResponse, Service } from "@/types";

export const removeServiceAddon = async (
  addonId: string
): Promise<ApiResponse<Service>> => {
  try {
    const res = await axiosInstance.delete<ApiResponse<Service>>(
      `/services-addons/${addonId}`
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
      throw new Error("Failed to remove service add-on");
    }
  }
};
