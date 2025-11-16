// src/api/user.ts
import axiosInstance, { ApiErrorResponse, ApiResponse } from "@/configs/axios";
import { AxiosError } from "axios";
import { IUser } from "@/types";

// ✅ getMe function
export const getMe = async (): Promise<ApiResponse<IUser>> => {
  try {
    const res = await axiosInstance.post<ApiResponse<IUser>>("/users/get-me");

    if (!res.data.data) {
      throw new Error("User data not found");
    }
    return res.data;
  } catch (error) {
    const axiosError = error as AxiosError<ApiErrorResponse>;

    if (axiosError.response?.data) {
      const errorData = axiosError.response.data;
      throw new Error(errorData.message);
    } else if (axiosError.message) {
      throw new Error(axiosError.message);
    } else {
      throw new Error("Failed to fetch user information.");
    }
  }
};
