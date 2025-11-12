// TypeScript types for Category entity
export interface ImageMetadata {
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

export interface CategoryAddon {
  id: string;
  addonText: string;
  sortOrder: number;
  isActive: boolean;
  parentCategoryId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Service {
  id: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  image: ImageMetadata;
  isActive: boolean;
  isPremium: boolean;
  parentCategoryId: string;
  createdAt: Date;
  updatedAt: Date;
  serviceAddons?: ServiceAddon[];
}

export interface ServiceAddon {
  id: string;
  addonText: string;
  price: number;
  sortOrder: number;
  isActive: boolean;
  parentServiceId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  profileUrl?: string;
}

// Flattened type for export (only primitive types)
export type CategoryExportData = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  isActive: boolean;
  isPremium: boolean;
  isRepairingService: boolean;
  isShowHome: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

export interface Category {
  id: string;
  name: string;
  tagline?: string;
  description?: string;
  cardImageId?: string;
  detailsImageId?: string;
  isPremium: boolean;
  isRepairingService: boolean;
  isShowHome: boolean;
  isActive: boolean;
  sortOrder: number;
  userId?: string;
  createdAt: Date;
  updatedAt: Date;

  // Relations
  categoryAddons?: CategoryAddon[];
  services?: Service[];
  cardImage?: ImageMetadata;
  detailsImage?: ImageMetadata;
  createdBy?: User;
  _count?: {
    services: number;
    categoryAddons: number;
  };
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  pagination?: {
    page: number;
    limit: number;
    total_items: number;
    total_pages: number;
  };
}

export interface CategoriesResponse {
  success: boolean;
  message: string;
  data: Category[];
  pagination: {
    page: number;
    limit: number;
    total_items: number;
    total_pages: number;
  };
}

export interface CategoriesForExportResponse {
  success: boolean;
  message: string;
  data: Category[];
  summary: {
    total: number;
    exportedAt: string;
  };
}

export interface CategoryResponse {
  success: boolean;
  message: string;
  data: Category;
}

// Request types
export interface CreateCategoryRequest {
  name: string;
  tagline?: string;
  description?: string;
  cardImage?: ImageMetadata;
  detailsImage?: ImageMetadata;
  isPremium?: boolean;
  isRepairingService?: boolean;
  isShowHome?: boolean;
  isActive?: boolean;
  sortOrder?: number;
  userId?: string;
  addons?: string[];
}

export interface UpdateCategoryRequest {
  name?: string;
  tagline?: string;
  description?: string;
  cardImage?: ImageMetadata;
  detailsImage?: ImageMetadata;
  isPremium?: boolean;
  isRepairingService?: boolean;
  isShowHome?: boolean;
  isActive?: boolean;
  sortOrder?: number;
  userId?: string | null;
  addons?: string[];
}

export interface GetAllCategoriesRequest {
  page?: number;
  limit?: number;
  sortBy?:
    | "name"
    | "sortOrder"
    | "createdAt"
    | "updatedAt"
    | "isPremium"
    | "isActive";
  sortOrder?: "asc" | "desc";
  isActive?: boolean;
  isPremium?: boolean;
  isRepairingService?: boolean;
  isShowHome?: boolean;
  search?: string;
  userId?: string;
  from_date?: string;
  to_date?: string;
}

export interface GetCategoryDetailsRequest {
  includeInactive?: boolean;
}

export interface SwapCategoriesRequest {
  categoryId1: string;
  categoryId2: string;
}

export interface GetBulkCategoriesRequest {
  ids?: string[];
  isActive?: boolean;
  isPremium?: boolean;
  isRepairingService?: boolean;
  isShowHome?: boolean;
}

// Delete response type
export interface DeleteCategoryResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    name: string;
    deletedAddonsCount: number;
    deletedImagesCount: number;
    cloudinaryDeletions: Array<{
      type: string;
      result: {
        public_id: string;
        secure_url: string;
      };
    }>;
  };
}
