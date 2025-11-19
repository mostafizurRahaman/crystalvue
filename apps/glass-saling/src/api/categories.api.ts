import axiosInstance from "@/configs/axios";
import {
  GetAllCategoriesResponse,
  Category,
  GetAllCategoriesParams,
} from "./types";

export const getAllCategories = async (
  params?: GetAllCategoriesParams
): Promise<GetAllCategoriesResponse> => {
  const searchParams = new URLSearchParams();

  if (params) {
    if (params.page) searchParams.append("page", params.page.toString());
    if (params.limit) searchParams.append("limit", params.limit.toString());
    if (params.sortBy) searchParams.append("sortBy", params.sortBy);
    if (params.sortOrder) searchParams.append("sortOrder", params.sortOrder);
    if (params.isActive !== undefined)
      searchParams.append("isActive", params.isActive.toString());
    if (params.isPremium !== undefined)
      searchParams.append("isPremium", params.isPremium.toString());
    if (params.isRepairingService !== undefined)
      searchParams.append(
        "isRepairingService",
        params.isRepairingService.toString()
      );
    if (params.isShowHome !== undefined)
      searchParams.append("isShowHome", params.isShowHome.toString());
    if (params.search) searchParams.append("search", params.search);
    if (params.userId) searchParams.append("userId", params.userId);
    if (params.from_date) searchParams.append("from_date", params.from_date);
    if (params.to_date) searchParams.append("to_date", params.to_date);
  }

  const url = searchParams.toString()
    ? `/categories?${searchParams.toString()}`
    : "/categories";

  const response = await axiosInstance.get<GetAllCategoriesResponse>(url);
  return response.data;
};

export const getCategories = async (
  params?: GetAllCategoriesParams
): Promise<Category[]> => {
  const response = await getAllCategories(params);
  return response.data || [];
};

// Server-side optimized function for Next.js server components
// Uses native fetch for better SSR performance and caching
export const getAllCategoriesServer = async (
  params?: GetAllCategoriesParams
): Promise<GetAllCategoriesResponse> => {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8000/api/v1";

  const searchParams = new URLSearchParams();

  if (params) {
    if (params.page) searchParams.append("page", params.page.toString());
    if (params.limit) searchParams.append("limit", params.limit.toString());
    if (params.sortBy) searchParams.append("sortBy", params.sortBy);
    if (params.sortOrder) searchParams.append("sortOrder", params.sortOrder);
    if (params.isActive !== undefined)
      searchParams.append("isActive", params.isActive.toString());
    if (params.isPremium !== undefined)
      searchParams.append("isPremium", params.isPremium.toString());
    if (params.isRepairingService !== undefined)
      searchParams.append(
        "isRepairingService",
        params.isRepairingService.toString()
      );
    if (params.isShowHome !== undefined)
      searchParams.append("isShowHome", params.isShowHome.toString());
    if (params.search) searchParams.append("search", params.search);
    if (params.userId) searchParams.append("userId", params.userId);
    if (params.from_date) searchParams.append("from_date", params.from_date);
    if (params.to_date) searchParams.append("to_date", params.to_date);
  }

  const url = searchParams.toString()
    ? `${baseUrl}/categories?${searchParams.toString()}`
    : `${baseUrl}/categories`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // Cache for 5 minutes (300 seconds) - adjust as needed
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch categories: ${response.status} ${response.statusText}`
      );
    }

    const data: GetAllCategoriesResponse = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Failed to fetch categories");
    }

    return data;
  } catch (error) {
    console.error("Error fetching categories (server):", error);
    // Return empty response structure in case of error
    return {
      status: 500,
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to fetch categories",
      data: [],
    };
  }
};

// Server-side function to get a single category by ID
export const getCategoryByIdServer = async (
  categoryId: string
): Promise<Category | null> => {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8000/api/v1";

  try {
    const response = await fetch(
      `${baseUrl}/categories/${categoryId}?includeInactive=true`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        // Cache for 5 minutes (300 seconds) - adjust as needed
        next: { revalidate: 300 },
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(
        `Failed to fetch category: ${response.status} ${response.statusText}`
      );
    }

    const data: { success: boolean; message: string; data: Category } =
      await response.json();

    if (!data.success || !data.data) {
      return null;
    }

    return data.data;
  } catch (error) {
    console.error("Error fetching category by ID (server):", error);
    return null;
  }
};
