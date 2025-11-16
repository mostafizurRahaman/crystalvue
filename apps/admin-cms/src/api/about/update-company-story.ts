import axiosInstance, { ApiErrorResponse } from "@/configs/axios";
import { AxiosError } from "axios";
import { CompanyStory, AboutPageBannerImage } from "./get-about-page";

export interface UpdateCompanyStoryRequest {
  title?: string;
  content: string;
  leftImage?: {
    id?: string;
    url: string;
    publicId?: string;
    folder?: string;
    altText?: string;
    width?: number;
    height?: number;
    format?: string;
    size?: number;
  };
  isActive?: boolean;
}

export interface CompanyStoryUpdateResponse {
  success: boolean;
  message: string;
  data: {
    companyStory: CompanyStory & {
      leftImage: AboutPageBannerImage | null;
    };
  };
}

/**
 * Update company story
 */
export async function updateCompanyStory(
  data: UpdateCompanyStoryRequest
): Promise<CompanyStoryUpdateResponse> {
  try {
    const response = await axiosInstance.put<CompanyStoryUpdateResponse>(
      "/about/story",
      data
    );

    if (!response.data) {
      throw new Error("Company story update response not found");
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
      throw new Error("Failed to update company story");
    }
  }
}
