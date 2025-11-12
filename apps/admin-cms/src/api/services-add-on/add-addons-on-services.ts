import axiosInstance, { ApiErrorResponse } from "@/configs/axios";
import { AxiosError } from "axios";
import { AddServiceAddonRequest, ApiResponse, Service } from "@/types";

export const addServiceAddon = async (
  serviceId: string,
  data: AddServiceAddonRequest
): Promise<ApiResponse<Service>> => {
  try {
    const res = await axiosInstance.post<ApiResponse<Service>>(
      `/services/addons`,
      { ...data, serviceId }
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
      throw new Error("Failed to add service add-on");
    }
  }
};
