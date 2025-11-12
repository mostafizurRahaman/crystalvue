import axiosInstance from "@/configs/axios";
import { 
  GetAllCategoriesResponse, 
  Category, 
  GetAllCategoriesParams 
} from "./types";

export const getAllCategories = async (
  params?: GetAllCategoriesParams
): Promise<GetAllCategoriesResponse> => {
  const searchParams = new URLSearchParams();
  
  if (params) {
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());
    if (params.sortBy) searchParams.append('sortBy', params.sortBy);
    if (params.sortOrder) searchParams.append('sortOrder', params.sortOrder);
    if (params.isActive !== undefined) searchParams.append('isActive', params.isActive.toString());
    if (params.isPremium !== undefined) searchParams.append('isPremium', params.isPremium.toString());
    if (params.isRepairingService !== undefined) searchParams.append('isRepairingService', params.isRepairingService.toString());
    if (params.isShowHome !== undefined) searchParams.append('isShowHome', params.isShowHome.toString());
    if (params.search) searchParams.append('search', params.search);
    if (params.userId) searchParams.append('userId', params.userId);
    if (params.from_date) searchParams.append('from_date', params.from_date);
    if (params.to_date) searchParams.append('to_date', params.to_date);
  }
  
  const url = searchParams.toString() 
    ? `/categories?${searchParams.toString()}`
    : "/categories";
    
  const response = await axiosInstance.get<GetAllCategoriesResponse>(url);
  return response.data;
};

export const getCategories = async (
  params?: GetAllCategoriesParams
): Promise<Category[]> => {
  const response = await getAllCategories(params);
  return response.data || [];
};
