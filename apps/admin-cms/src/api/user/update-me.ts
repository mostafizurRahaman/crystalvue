import axiosInstance, { ApiErrorResponse, ApiResponse } from "@/configs/axios";
import { AxiosError } from "axios";
import { IUser } from "@/types";

export interface UpdateMeRequest {
  name?: string;
  email?: string;
  password?: string;
  profileUrl?: string | null;
}

// ✅ updateMe function
export const updateMe = async (
  data: UpdateMeRequest
): Promise<ApiResponse<IUser>> => {
  try {
    const res = await axiosInstance.put<ApiResponse<IUser>>(
      "/users/update-me",
      data
    );

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
      throw new Error("Failed to update profile.");
    }
  }
};
