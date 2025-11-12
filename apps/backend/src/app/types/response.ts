export interface IPagination {
  limit: number;
  page: number;
  total_items: number;
  total_pages: number;
}

export interface IApiResponse<T, K> {
  status: number;
  success: boolean;
  message: string;
  data: T | null;
  pagination?: IPagination;
  summary?: K | null;
}

export interface IErrorApiResponse {
  status: number;
  message: string;
  errors?: object | null;
  stack?: string;
}
