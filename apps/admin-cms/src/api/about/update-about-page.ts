import axiosInstance, { ApiErrorResponse, ApiResponse } from "@/configs/axios";
import { AxiosError } from "axios";
import { AboutPageData } from "./get-about-page";

export interface UpdateAboutPageImage {
  url: string;
  publicId: string;
  folder?: string;
  altText?: string;
  width?: number;
  height?: number;
  format?: string;
  size?: number;
}

export interface UpdateAboutPageRequest {
  introTitle?: string;
  introSubtitle?: string;
  heroText?: string;
  bannerImage?: UpdateAboutPageImage;
  isActive?: boolean;
}

/**
 * Update about page
 */
export async function updateAboutPage(
  data: UpdateAboutPageRequest
): Promise<ApiResponse<AboutPageData>> {
  try {
    const response = await axiosInstance.put<ApiResponse<AboutPageData>>(
      "/about",
      data
    );

    if (!response.data) {
      throw new Error("About page update response not found");
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
      throw new Error("Failed to update about page");
    }
  }
}
