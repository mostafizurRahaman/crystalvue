import axiosInstance, { ApiErrorResponse } from "@/configs/axios";
import { AxiosError } from "axios";

export interface AboutPageBannerImage {
  id: string;
  url: string;
  publicId: string;
  altText: string | null;
  width: number | null;
  height: number | null;
  format: string | null;
}

export interface AboutPageData {
  id: number;
  introTitle: string | null;
  introSubtitle: string | null;
  heroText: string | null;
  isActive: boolean;
  bannerImage: AboutPageBannerImage | null;
  companyStory: CompanyStory | null;
  visionBlock: AboutBlock | null;
  missionBlock: AboutBlock | null;
}

export interface CompanyStory {
  id: string;
  title: string;
  content: string;
  isActive: boolean;
  leftImage: AboutPageBannerImage | null;
}

export interface AboutBlock {
  id: string;
  type: "VISION" | "MISSION";
  title: string;
  content: string;
  isActive: boolean;
  image: AboutPageBannerImage | null;
}

export interface AboutPageResponse {
  success: boolean;
  message: string;
  data: AboutPageData;
}

/**
 * Get complete about page data
 */
export async function getAboutPage(): Promise<AboutPageResponse> {
  try {
    const response = await axiosInstance.get<AboutPageResponse>("/about");
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ApiErrorResponse>;

    if (axiosError.response?.data) {
      const errorData = axiosError.response.data;
      throw new Error(errorData.message);
    } else if (axiosError.message) {
      throw new Error(axiosError.message);
    } else {
      throw new Error("Failed to get about page data");
    }
  }
}
