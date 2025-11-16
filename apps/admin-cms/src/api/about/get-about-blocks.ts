import axiosInstance, { ApiErrorResponse } from "@/configs/axios";
import { AxiosError } from "axios";
import { AboutBlock } from "./get-about-page";

export interface AboutBlocksResponse {
  success: boolean;
  message: string;
  data: {
    visionBlock: AboutBlock | null;
    missionBlock: AboutBlock | null;
  };
}

/**
 * Get vision and mission blocks
 */
export async function getAboutBlocks(): Promise<AboutBlocksResponse> {
  try {
    const response =
      await axiosInstance.get<AboutBlocksResponse>("/about/blocks");
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ApiErrorResponse>;

    if (axiosError.response?.data) {
      const errorData = axiosError.response.data;
      throw new Error(errorData.message);
    } else if (axiosError.message) {
      throw new Error(axiosError.message);
    } else {
      throw new Error("Failed to get about blocks");
    }
  }
}
