import axiosInstance from "@/configs/axios";

// Define types for about page data
export interface ImageData {
  id: string;
  url: string;
  publicId: string;
  altText?: string;
  width?: number;
  height?: number;
  format?: string;
}

export interface CompanyStory {
  id: string;
  title?: string;
  content: string;
  leftImage?: ImageData;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AboutBlock {
  id: string;
  type: "VISION" | "MISSION";
  title: string;
  content: string;
  image?: ImageData;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AboutPageData {
  id: number;
  introTitle?: string;
  introSubtitle?: string;
  heroText?: string;
  bannerImage?: ImageData;
  companyStory?: CompanyStory;
  visionBlock?: AboutBlock;
  missionBlock?: AboutBlock;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AboutBlocksResponse {
  success: boolean;
  message: string;
  data: {
    visionBlock?: AboutBlock;
    missionBlock?: AboutBlock;
  };
}

export interface AboutPageResponse {
  success: boolean;
  message: string;
  data: AboutPageData;
}

export interface CompanyStoryResponse {
  success: boolean;
  message: string;
  data: {
    companyStory?: CompanyStory;
  };
}

// API functions
export const getAboutPageData = async (): Promise<AboutPageResponse> => {
  const response = await axiosInstance.get<AboutPageResponse>("/about");
  return response.data;
};

export const getAboutBlocks = async (): Promise<AboutBlocksResponse> => {
  const response = await axiosInstance.get<AboutBlocksResponse>("/about/blocks");
  return response.data;
};

export const getCompanyStory = async (): Promise<CompanyStoryResponse> => {
  const response = await axiosInstance.get<CompanyStoryResponse>("/about/story");
  return response.data;
};
