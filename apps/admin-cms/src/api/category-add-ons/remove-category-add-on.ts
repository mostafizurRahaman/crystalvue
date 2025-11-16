import axiosInstance from "@/configs/axios";

export interface RemoveCategoryAddOnRequest {
  addonIds?: string[];
  addonTexts?: string[];
}

export interface RemoveCategoryAddOnResponse {
  success: boolean;
  message: string;
  data: {
    category: {
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
      _count: {
        categoryAddons: number;
        services: number;
      };
    };
    removed: {
      count: number;
      addons: Array<{
        id: string;
        text: string;
      }>;
    };
  };
}

/**
 * Remove add-ons from a category
 */
export async function removeCategoryAddOn(
  categoryId: string,
  data: RemoveCategoryAddOnRequest
): Promise<RemoveCategoryAddOnResponse> {
  const response = await axiosInstance.delete<RemoveCategoryAddOnResponse>(
    `/categories/addons/${categoryId}/addons`,
    { data }
  );
  return response.data;
}
