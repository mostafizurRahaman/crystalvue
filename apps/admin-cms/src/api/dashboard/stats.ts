import axiosInstance from "@/configs/axios";

// Type definitions for dashboard API responses
export interface OverviewStatsResponse {
  success: boolean;
  message: string;
  data: {
    totalContacts: number;
    pendingContacts: number;
    thisMonthContacts: number;
    lastMonthContacts: number;
    contactGrowth: number;
    activeCategories: number;
    activeServices: number;
    avgRating: number;
    newUsers: number;
    totalUsers: number;
  };
}

export interface ContactTrendsResponse {
  success: boolean;
  message: string;
  data: Array<{
    month: string;
    count: number;
  }>;
}

export interface ContactStatusResponse {
  success: boolean;
  message: string;
  data: Record<string, number>;
}

export interface CategoryPerformanceResponse {
  success: boolean;
  message: string;
  data: {
    categories: Array<{
      name: string;
      inquiries: number;
      categoryId: string;
    }>;
  };
}

export interface RatingDistributionResponse {
  success: boolean;
  message: string;
  data: Record<string, number>;
}

export interface RecentActivityResponse {
  success: boolean;
  message: string;
  data: {
    contacts: Array<{
      id: string;
      fullName: string;
      email?: string;
      status: string;
      createdAt: string;
      parentCategory?: {
        name: string;
      };
      service?: {
        name: string;
      };
    }>;
  };
}

export interface GalleryCategoriesResponse {
  success: boolean;
  message: string;
  data: Record<string, number>;
}

// API functions
export const getOverviewStats = async (): Promise<OverviewStatsResponse> => {
  const response = await axiosInstance.get("/dashboard/overview");
  return response.data;
};

export const getContactTrends = async (): Promise<ContactTrendsResponse> => {
  const response = await axiosInstance.get("/dashboard/contact-trends");
  return response.data;
};

export const getContactStatusDistribution =
  async (): Promise<ContactStatusResponse> => {
    const response = await axiosInstance.get("/dashboard/contact-status");
    return response.data;
  };

export const getCategoryPerformance =
  async (): Promise<CategoryPerformanceResponse> => {
    const response = await axiosInstance.get("/dashboard/category-performance");
    return response.data;
  };

export const getRatingDistribution =
  async (): Promise<RatingDistributionResponse> => {
    const response = await axiosInstance.get("/dashboard/rating-distribution");
    return response.data;
  };

export const getRecentActivity = async (): Promise<RecentActivityResponse> => {
  const response = await axiosInstance.get("/dashboard/recent-activity");
  return response.data;
};

export const getGalleryCategories =
  async (): Promise<GalleryCategoriesResponse> => {
    const response = await axiosInstance.get("/dashboard/gallery-categories");
    return response.data;
  };
