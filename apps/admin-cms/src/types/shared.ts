// Shared types used across multiple modules

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

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  pagination?: {
    page?: number;
    currentPage?: number;
    limit: number;
    total_items: number;
    total_pages: number;
  };
  summary?: unknown;
}
