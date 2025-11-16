import axiosInstance, { ApiErrorResponse } from "@/configs/axios";
import { AxiosError } from "axios";

export interface SettingsImage {
  id: string;
  url: string;
  publicId: string;
  altText: string | null;
  width: number | null;
  height: number | null;
  format: string | null;
}

export interface SettingsData {
  id: number;
  siteTitle: string | null;
  siteDescription: string | null;
  logoImage: SettingsImage | null;
  faviconImage: SettingsImage | null;
  metaImage: SettingsImage | null;
  contactEmail: string | null;
  contactPhone: string | null;
  contactWhatsApp: string | null;
  officeAddress: string | null;
  googleMapEmbedCode: string | null;
  socialMediaLinks: Record<string, string> | null;
  businessHours: Record<string, string> | null;
  seoMetaTitle: string | null;
  seoMetaDescription: string | null;
  seoKeywords: string | null;
  isActive: boolean;
}

export interface SettingsResponse {
  success: boolean;
  message: string;
  data: SettingsData;
}

/**
 * Get global settings
 */
export async function getSettings(): Promise<SettingsResponse> {
  try {
    const response = await axiosInstance.get<SettingsResponse>("/settings");
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ApiErrorResponse>;

    if (axiosError.response?.data) {
      const errorData = axiosError.response.data;
      throw new Error(errorData.message);
    } else if (axiosError.message) {
      throw new Error(axiosError.message);
    } else {
      throw new Error("Failed to get settings data");
    }
  }
}
