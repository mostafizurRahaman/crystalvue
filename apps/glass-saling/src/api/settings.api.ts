import axiosInstance from "@/configs/axios";

// Types for the settings API
export interface ImageSettings {
  id: string;
  url: string;
  publicId: string;
  altText: string | null;
  width: number | null;
  height: number | null;
  format: string | null;
}

export interface GlobalSettings {
  id: number;
  siteTitle: string | null;
  siteDescription: string | null;
  logoImage: ImageSettings | null;
  faviconImage: ImageSettings | null;
  metaImage: ImageSettings | null;
  contactEmail: string | null;
  contactPhone: string | null;
  contactWhatsApp: string | null;
  officeAddress: string | null;
  googleMapEmbedCode: string | null;
  socialMediaLinks: {
    facebook: string | null;
    instagram: string | null;
    twitter: string | null;
    linkedin: string | null;
    youtube: string | null;
  } | null;
  businessHours: {
    openingText: string | null;
    closeText: string | null;
  } | null;
  seoMetaTitle: string | null;
  seoMetaDescription: string | null;
  seoKeywords: string | null;
  isActive: boolean;
}

export interface SettingsApiResponse {
  success: boolean;
  message: string;
  data: GlobalSettings;
}

// API function to get settings
export const getSettings = async (): Promise<GlobalSettings> => {
  try {
    const response = await axiosInstance.get<SettingsApiResponse>("/settings");

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to fetch settings");
    }

    return response.data.data;
  } catch (error) {
    console.error("Error fetching settings:", error);
    // Return default settings in case of error
    return {
      id: 1,
      siteTitle: null,
      siteDescription: null,
      logoImage: null,
      faviconImage: null,
      metaImage: null,
      contactEmail: null,
      contactPhone: null,
      contactWhatsApp: null,
      officeAddress: null,
      googleMapEmbedCode: null,
      socialMediaLinks: null,
      businessHours: null,
      seoMetaTitle: null,
      seoMetaDescription: null,
      seoKeywords: null,
      isActive: true,
    };
  }
};
