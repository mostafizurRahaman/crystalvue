import axiosInstance from "@/configs/axios";
import { CreateContactUsFormResponse, ContactFormData } from "./types";

export const createContactUsForm = async (
  formData: ContactFormData
): Promise<CreateContactUsFormResponse> => {
  const response = await axiosInstance.post<CreateContactUsFormResponse>("/contact-us/create", formData);
  return response.data;
};
