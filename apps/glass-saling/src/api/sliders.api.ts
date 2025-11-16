import axiosInstance from "@/configs/axios";
import { 
  GetAllSlidersResponse, 
  Slider, 
  GetAllSlidersParams 
} from "./types";

export const getAllSliders = async (
  params?: GetAllSlidersParams
): Promise<GetAllSlidersResponse> => {
  const searchParams = new URLSearchParams();
  
  if (params) {
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());
    if (params.sortBy) searchParams.append('sortBy', params.sortBy);
    if (params.sortOrder) searchParams.append('sortOrder', params.sortOrder);
    if (params.active_only !== undefined) searchParams.append('active_only', params.active_only.toString());
    if (params.from_date) searchParams.append('from_date', params.from_date);
    if (params.to_date) searchParams.append('to_date', params.to_date);
    if (params.search) searchParams.append('search', params.search);
  }
  
  const url = searchParams.toString() 
    ? `/sliders/get-all?${searchParams.toString()}`
    : "/sliders/get-all";
    
  const response = await axiosInstance.get<GetAllSlidersResponse>(url);
  return response.data;
};

export const getSliders = async (
  params?: GetAllSlidersParams
): Promise<Slider[]> => {
  const response = await getAllSliders(params);
  return response.data || [];
};
