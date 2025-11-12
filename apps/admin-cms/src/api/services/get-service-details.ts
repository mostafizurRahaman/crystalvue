import axiosInstance, { ApiErrorResponse } from "@/configs/axios";
import { AxiosError } from "axios";
import { ServiceResponse } from "@/types";

export const getServiceDetails = async (
  id: string,
  options: { includeInactive?: boolean } = {}
): Promise<ServiceResponse> => {
  try {
    const { includeInactive = false } = options;

    const queryParams = new URLSearchParams();
    if (includeInactive) {
      queryParams.append("includeInactive", "true");
    }

    const url = `/services/${id}${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
    const res = await axiosInstance.get<ServiceResponse>(url);

    if (!res.data.data) {
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
      throw new Error("Failed to fetch service details");
    }
  }
};
