import axiosInstance, { ApiErrorResponse } from "@/configs/axios";
import { AxiosError } from "axios";
import { IUser } from "@/types";

interface ILoginPayload {
  email: string;
  password: string;
}

interface ILoginResponse {
  success: boolean;
  message: string;
  data: IUser & { accessToken?: string };
  summary?: unknown;
}

export const loginUser = async (
  user: ILoginPayload
): Promise<ILoginResponse> => {
  try {
    const res = await axiosInstance.post("/auth/sign-in", user);
    return res.data;
  } catch (error) {
    const axiosError = error as AxiosError<ApiErrorResponse>;

    if (axiosError.response?.data) {
      // Backend returns structured error response (ApiErrorResponse)
      const errorData = axiosError.response.data;
      throw new Error(errorData.message);
    } else if (axiosError.message) {
      // Network or other axios errors
      throw new Error(axiosError.message);
    } else {
      // Fallback error
      throw new Error("Login failed. Please try again.");
    }
  }
};
