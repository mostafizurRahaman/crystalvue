import axiosInstance, { ApiErrorResponse } from "@/configs/axios";
import { AxiosError } from "axios";
import { ContactInquiryResponse } from "./types";

export const getContactUsDetails = async (id: string): Promise<ContactInquiryResponse> => {
  try {
    const res = await axiosInstance.get<ContactInquiryResponse>(`/contact-us/${id}`);

    if (!res.data.data) {
      throw new Error("Contact inquiry data not found");
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
      throw new Error("Failed to fetch contact inquiry details");
    }
  }
};
