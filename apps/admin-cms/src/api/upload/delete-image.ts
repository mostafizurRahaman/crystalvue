import axiosInstance, { ApiErrorResponse } from "@/configs/axios";
import { AxiosError } from "axios";

// Define the expected success response type from your backend
interface DeleteImageResponse {
  success: boolean;
  message: string;
}

/**
 * Calls the backend API to delete an image from Cloudinary by its public ID.
 *
 * @param {string} publicId - The public ID of the image to be deleted.
 * @returns {Promise<DeleteImageResponse>} A promise that resolves with the success message from the API.
 * @throws {Error} Throws an error with a user-friendly message if the API call fails.
 */
export const deleteCloudinaryImage = async (
  publicId: string
): Promise<DeleteImageResponse> => {
  // Basic validation on the frontend before sending the request
  if (!publicId) {
    throw new Error("Public ID cannot be empty.");
  }

  try {
    const response = await axiosInstance.delete<DeleteImageResponse>(
      "/uploads/delete",
      {
        data: { publicId },
      }
    );

    return response.data;
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
