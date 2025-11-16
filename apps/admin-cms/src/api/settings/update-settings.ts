import axiosInstance, { ApiErrorResponse, ApiResponse } from "@/configs/axios";
import { AxiosError } from "axios";
import { SettingsData } from "./get-settings";

export interface UpdateSettingsImage {
  url: string;
  publicId: string;
  folder?: string;
  altText?: string;
  width?: number;
  height?: number;
  format?: string;
  size?: number;
}

export interface UpdateSettingsRequest {
  siteTitle?: string;
  siteDescription?: string;
  logoImage?: UpdateSettingsImage;
  faviconImage?: UpdateSettingsImage;
  metaImage?: UpdateSettingsImage;
  contactEmail?: string;
  contactPhone?: string;
  contactWhatsApp?: string;
  officeAddress?: string;
  googleMapEmbedCode?: string;
  socialMediaLinks?: Record<string, string>;
  businessHours?: Record<string, string>;
  seoMetaTitle?: string;
  seoMetaDescription?: string;
  seoKeywords?: string;
  isActive?: boolean;
}

/**
 * Update global settings
 */
export async function updateSettings(
  data: UpdateSettingsRequest
): Promise<ApiResponse<SettingsData>> {
  try {
    const response = await axiosInstance.put<ApiResponse<SettingsData>>(
      "/settings",
      data
    );

    if (!response.data) {
      throw new Error("Settings update response not found");
    }
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ApiErrorResponse>;

    if (axiosError.response?.data) {
      const errorData = axiosError.response.data;
      throw new Error(errorData.message);
    } else if (axiosError.message) {
      throw new Error(axiosError.message);
    } else {
      throw new Error("Failed to update settings");
    }
  }
}
