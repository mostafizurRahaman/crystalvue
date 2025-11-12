import axiosInstance, { ApiErrorResponse } from "@/configs/axios";
import { AxiosError } from "axios";

export const deleteContactUs = async (id: string): Promise<{ message: string }> => {
  try {
    const res = await axiosInstance.delete<{ message: string }>(`/contact-us/${id}`);
    return res.data;
  } catch (error) {
    const axiosError = error as AxiosError<ApiErrorResponse>;

    if (axiosError.response?.data) {
      const errorData = axiosError.response.data;
      throw new Error(errorData.message);
    } else if (axiosError.message) {
      throw new Error(axiosError.message);
    } else {
      throw new Error("Failed to delete contact inquiry");
    }
  }
};
