// TypeScript types for Gallery entity
export type GalleryCategory =
  | "SHOWER_ENCLOSURES"
  | "GLASS_DOORS"
  | "RAILINGS"
  | "WINDOWS"
  | "UPVC";

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

export interface Gallery {
  id: string;
  caption?: string;
  isActive: boolean;
  galleryCategory?: GalleryCategory;
  imageId: string;
  createdAt: Date;
  updatedAt: Date;

  // Relations
  image?: ImageMetadata;
}

// Flattened type for export (only primitive types)
export type GalleryExportData = {
  id: string;
  caption: string | null;
  isActive: boolean;
  galleryCategory: GalleryCategory | null;
  imageId: string;
  createdAt: string;
  updatedAt: string;
  imageUrl: string;
  imagePublicId: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  pagination?: {
    currentPage: number;
    total_pages: number;
    total_items: number;
    limit: number;
  };
}

export interface GalleriesResponse {
  success: boolean;
  message: string;
  data: Gallery[];
  pagination: {
    page: number;
    limit: number;
    total_items: number;
    total_pages: number;
  };
}

export interface GalleryResponse {
  success: boolean;
  message: string;
  data: {
    gallery: Gallery;
  };
}

export interface GalleryBulkExportResponse {
  success: boolean;
  message: string;
  data: Gallery[];
  summary?: {
    total: number;
    exportedAt: string;
  };
}

// Request types
export interface CreateGalleryRequest {
  galleryCategory?: GalleryCategory;
  image: ImageMetadata;
  caption?: string;
  isActive?: boolean;
}

export interface UpdateGalleryRequest {
  caption?: string;
  galleryCategory?: GalleryCategory | null;
  isActive?: boolean;
}

export interface GetAllGalleriesRequest {
  page?: number;
  limit?: number;
  galleryCategory?: GalleryCategory;
  search?: string;
  isActive?: boolean;
  sortBy?: "createdAt" | "caption";
  sortOrder?: "asc" | "desc";
  from_date?: string;
  to_date?: string;
}

export interface GetGalleryDetailsRequest {
  id: string;
}

export interface DeleteGalleryResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    caption?: string;
    galleryCategory?: GalleryCategory;
    deletedImageId?: string;
    cloudinaryDeletion?: {
      type: string;
      result: {
        public_id: string;
        secure_url: string;
      };
    };
  };
}

export interface GetGalleriesForBulkExportRequest {
  ids?: string[];
  galleryCategory?: GalleryCategory;
  isActive?: boolean;
  limit?: number;
}
