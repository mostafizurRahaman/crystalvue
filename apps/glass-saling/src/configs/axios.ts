import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

// ✅ Extend Axios config to include custom `_retry` property
declare module "axios" {
  export interface InternalAxiosRequestConfig {
    _retry?: boolean;
  }
}

// ✅ Backend Base URL
const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8000/api/v1";

// ☑️ Pagination :
export interface IPagination {
  limit: number;
  page: number;
  total_items: number;
  total_pages: number;
}

// ✅ API Response Type
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  pagination?: IPagination;
  summary?: unknown;
}

// ✅ Error Response Type
export interface ApiErrorResponse {
  success: false;
  message: string;
  errorSources: {
    path: string;
    message: string;
  }[];
  stack?: string | null;
}

// ✅ Create Axios Instance
const axiosInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Helper functions to manage token in localStorage
const TOKEN_KEY = process.env.NEXT_PUBLIC_TOKEN_KEY!;

const getAccessToken = (): string | null => localStorage.getItem(TOKEN_KEY);

export const setAccessToken = (token: string | null): void => {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
};

// ✅ Types for queue handling
interface FailedRequest {
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}

// ✅ Refresh queue control
let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

const processQueue = (error: unknown, token: string | null = null): void => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else if (token) prom.resolve(token);
  });
  failedQueue = [];
};

// ✅ Attach token to every request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Handle expired token (401) and retry
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError<ApiErrorResponse>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig;
    const status = error.response?.status;

    if (status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers)
              originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshResponse = await axiosInstance.post<
          ApiResponse<{ accessToken: string }>
        >("/auth/get-access-token");

        const newToken = refreshResponse.data.data?.accessToken || null;
        setAccessToken(newToken);
        processQueue(null, newToken);

        if (originalRequest.headers && newToken)
          originalRequest.headers.Authorization = `Bearer ${newToken}`;

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        setAccessToken(null);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
