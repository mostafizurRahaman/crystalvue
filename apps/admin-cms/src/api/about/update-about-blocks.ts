import axiosInstance, { ApiErrorResponse } from "@/configs/axios";
import { AxiosError } from "axios";
import { AboutBlock } from "./get-about-page";

export interface UpdateAboutBlockImage {
  id?: string;
  url: string;
  publicId?: string;
  folder?: string;
  altText?: string;
  width?: number;
  height?: number;
  format?: string;
  size?: number;
}

export interface UpdateAboutBlock {
  title: string;
  content: string;
  image?: UpdateAboutBlockImage;
  isActive?: boolean;
}

export interface UpdateAboutBlocksRequest {
  vision: UpdateAboutBlock;
  mission: UpdateAboutBlock;
}

export interface AboutBlocksUpdateResponse {
  success: boolean;
  message: string;
  data: {
    vision: AboutBlock;
    mission: AboutBlock;
  };
}

/**
 * Update vision and mission blocks
 */
export async function updateAboutBlocks(
  data: UpdateAboutBlocksRequest
): Promise<AboutBlocksUpdateResponse> {
  try {
    const response = await axiosInstance.put<AboutBlocksUpdateResponse>(
      "/about/blocks",
      data
    );

    if (!response.data) {
      throw new Error("About blocks update response not found");
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
      throw new Error("Failed to update about blocks");
    }
  }
}
