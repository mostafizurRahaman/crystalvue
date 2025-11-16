export type GalleryCategory =
  | "SHOWER_ENCLOSURES"
  | "GLASS_DOORS"
  | "RAILINGS"
  | "WINDOWS"
  | "UPVC";

export interface GalleryImage {
  id: string;
  url: string;
  publicId: string;
  altText?: string;
  width?: number;
  height?: number;
  format?: string;
}

export interface Gallery {
  id: string;
  caption?: string;
  isActive: boolean;
  galleryCategory?: GalleryCategory;
  imageId: string;
  createdAt: string;
  updatedAt?: string;
  image?: GalleryImage;
}

export interface GetAllGalleriesParams {
  page?: number;
  limit?: number;
  galleryCategory?: GalleryCategory;
  search?: string;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface GetAllGalleriesResponse {
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
