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

// Server-side optimized function for Next.js server components
export const getAboutPageDataServer = async (): Promise<AboutPageResponse> => {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8000/api/v1";

  try {
    const response = await fetch(`${baseUrl}/about`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // Cache for 5 minutes (300 seconds)
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch about page data: ${response.statusText}`
      );
    }

    const data: AboutPageResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching about page data (server):", error);
    // Return empty response structure
    return {
      success: false,
      message: "Failed to fetch about page data",
      data: {
        id: 1,
        isActive: true,
        createdAt: "",
        updatedAt: "",
      },
    };
  }
};

export const getAboutBlocks = async (): Promise<AboutBlocksResponse> => {
  const response =
    await axiosInstance.get<AboutBlocksResponse>("/about/blocks");
  return response.data;
};

export const getCompanyStory = async (): Promise<CompanyStoryResponse> => {
  const response =
    await axiosInstance.get<CompanyStoryResponse>("/about/story");
  return response.data;
};
