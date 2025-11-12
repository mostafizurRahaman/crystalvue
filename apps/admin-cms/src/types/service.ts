// TypeScript types for Service entity
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

export interface Service {
  id: string;
  name: string;
  tagline?: string;
  description?: string;
  price: number;
  isPremium: boolean;
  isActive: boolean;
  sortOrder: number;
  parentCategoryId: string;
  imageId?: string;
  createdAt: Date;
  updatedAt: Date;

  // Relations
  serviceAddons?: ServiceAddon[];
  image?: ImageMetadata;
  parentCategory?: {
    id: string;
    name: string;
  };
  _count?: {
    serviceAddons: number;
  };
}

// Flattened type for export (only primitive types)
export type ServiceExportData = {
  id: string;
  name: string;
  tagline: string | null;
  description: string | null;
  price: number;
  isPremium: boolean;
  isActive: boolean;
  sortOrder: number;
  parentCategoryId: string;
  createdAt: string;
  updatedAt: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

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

export interface ServicesResponse {
  success: boolean;
  message: string;
  data: Service[];
  pagination: {
    page: number;
    limit: number;
    total_items: number;
    total_pages: number;
  };
}

export interface ServicesForExportResponse {
  success: boolean;
  message: string;
  data: Service[];
  summary: {
    total: number;
    exportedAt: string;
  };
}

export interface ServiceResponse {
  success: boolean;
  message: string;
  data: Service;
}

// Request types
export interface CreateServiceRequest {
  parentCategoryId: string;
  name: string;
  tagline?: string;
  description?: string;
  image: ImageMetadata;
  price?: number;
  isPremium?: boolean;
  isActive?: boolean;
}

export interface UpdateServiceRequest {
  name?: string;
  tagline?: string;
  description?: string;
  image?: ImageMetadata;
  price?: number;
  isPremium?: boolean;
  isActive?: boolean;
}

export interface GetAllServicesRequest {
  page?: number;
  limit?: number;
  sortBy?:
    | "name"
    | "sortOrder"
    | "createdAt"
    | "updatedAt"
    | "isPremium"
    | "isActive"
    | "price";
  sortOrder?: "asc" | "desc";
  categoryId?: string;
  isActive?: boolean;
  isPremium?: boolean;
  search?: string;
  from_date?: string;
  to_date?: string;
}

export interface GetServiceDetailsRequest {
  includeInactive?: boolean;
}

export interface GetBulkServicesRequest {
  ids?: string[];
  categoryId?: string;
  isActive?: boolean;
  isPremium?: boolean;
  limit?: number;
}

export interface AddServiceAddonRequest {
  addonText: string;
  sortOrder?: number;
  isActive?: boolean;
}

export interface RemoveServiceAddonRequest {
  addonTexts: string[];
}

export interface DeleteServiceResponse {
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
