import axiosInstance from "@/configs/axios";
import { GetSlidersParams, GetSlidersResponse } from "@/schemas/sliders";

export const getAllSliders = async (params?: GetSlidersParams) => {
  const queryParams: Record<string, string | number | boolean> = {};

  if (params?.search) {
    queryParams.search = params.search;
  }
  if (params?.from_date) {
    queryParams.from_date = params.from_date;
  }
  if (params?.to_date) {
    queryParams.to_date = params.to_date;
  }
  if (params?.sort_by) {
    queryParams.sort_by = params.sort_by;
  }
  if (params?.sort_order) {
    queryParams.sort_order = params.sort_order;
  }
  if (params?.page !== undefined) {
    queryParams.page = params.page;
  }
  if (params?.limit !== undefined) {
    queryParams.limit = params.limit;
  }
  if (params?.active_only) {
    queryParams.active_only = params.active_only;
  }

  const response = await axiosInstance.get<GetSlidersResponse>(
    "/sliders/get-all",
    {
      params: queryParams,
    }
  );

  return response.data;
};

export const getSliders = getAllSliders;
