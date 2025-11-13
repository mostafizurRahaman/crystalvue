export interface ImageMetadata {
  id?: string;
  url: string;
  publicId?: string;
  folder?: string;
  altText?: string;
  width?: number;
  height: number;
  format: string;
  size: number;
}

export interface ContactInquiry {
  id: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  subject: string;
  message: string;
  status: "pending" | "in-progress" | "resolved" | "closed";
  images?: ImageMetadata[];
  createdAt: string;
  updatedAt: string;
}

export interface ContactUsResponse {
  success: boolean;
  message: string;
  data: ContactInquiry[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    limit: number;
  };
}

export interface ContactInquiryResponse {
  success: boolean;
  message: string;
  data: ContactInquiry;
}

export interface GetAllContactUsRequest {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
  from_date?: string;
  to_date?: string;
  status?: string;
}

export interface UpdateStatusRequest {
  status: "pending" | "in-progress" | "resolved" | "closed";
}
