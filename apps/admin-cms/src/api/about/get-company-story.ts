import axiosInstance, { ApiErrorResponse } from "@/configs/axios";
import { AxiosError } from "axios";
import { CompanyStory, AboutPageBannerImage } from "./get-about-page";

export interface CompanyStoryResponse {
  success: boolean;
  message: string;
  data: {
    companyStory: CompanyStory & {
      leftImage: AboutPageBannerImage | null;
    };
  };
}

/**
 * Get company story
 */
export async function getCompanyStory(): Promise<CompanyStoryResponse> {
  try {
    const response =
      await axiosInstance.get<CompanyStoryResponse>("/about/story");
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ApiErrorResponse>;

    if (axiosError.response?.data) {
      const errorData = axiosError.response.data;
      throw new Error(errorData.message);
    } else if (axiosError.message) {
      throw new Error(axiosError.message);
    } else {
      throw new Error("Failed to get company story");
    }
  }
}
