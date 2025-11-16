import axiosInstance from "@/configs/axios";
import {
  GetAllTestimonialsResponse,
  Testimonial,
  GetAllTestimonialsParams,
} from "./types";

export const getAllTestimonials = async (
  params?: GetAllTestimonialsParams
): Promise<GetAllTestimonialsResponse> => {
  const searchParams = new URLSearchParams();
  const limit = 50;
  if (params) {
    if (params.limit) searchParams.append("limit", String(limit));
    if (params.sortBy) searchParams.append("sortBy", "createdAt");
    if (params.sortOrder) searchParams.append("sortOrder", "desc");
  }

  const url = searchParams.toString()
    ? `/testimonials?${searchParams.toString()}`
    : "/testimonials";

  const response = await axiosInstance.get<GetAllTestimonialsResponse>(url);
  return response.data;
};

export const getTestimonials = async (
  params?: GetAllTestimonialsParams
): Promise<Testimonial[]> => {
  const response = await getAllTestimonials(params);
  return response.data || [];
};
