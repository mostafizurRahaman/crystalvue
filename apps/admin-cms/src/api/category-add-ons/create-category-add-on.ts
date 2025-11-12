import axiosInstance from "@/configs/axios";

export interface CreateCategoryAddOnRequest {
  addons: string[];
}

export interface CreateCategoryAddOnResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    name: string;
    tagline?: string;
    description?: string;
    cardImage?: {
      url: string;
      publicId: string;
      folder: string;
      altText?: string;
      width: number;
      height: number;
      format: string;
      size: number;
    };
    detailsImage?: {
      url: string;
      publicId: string;
      folder: string;
      altText?: string;
      width: number;
      height: number;
      format: string;
      size: number;
    };
    isPremium: boolean;
    isRepairingService: boolean;
    isShowHome: boolean;
    isActive: boolean;
    sortOrder: number;
    userId: string;
    createdAt: string;
    updatedAt: string;
    categoryAddons: Array<{
      id: string;
      addonText: string;
      sortOrder: number;
      isActive: boolean;
      createdAt: string;
      updatedAt: string;
    }>;
    services: Array<{
      id: string;
      name: string;
      description?: string;
      price?: number;
      isActive: boolean;
      sortOrder: number;
      createdAt: string;
      updatedAt: string;
    }>;
    createdBy: {
      id: string;
      name: string;
      email: string;
      profileUrl?: string;
    };
  };
}

/**
 * Add add-ons to a category
 */
export async function createCategoryAddOn(
  categoryId: string,
  data: CreateCategoryAddOnRequest
): Promise<CreateCategoryAddOnResponse> {
  const response = await axiosInstance.post<CreateCategoryAddOnResponse>(
    `/categories/addons/${categoryId}/addons`,
    data
  );
  return response.data;
}
