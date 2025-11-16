import axiosInstance from "@/configs/axios";
import { Slider } from "@/schemas/sliders";

export interface DeleteSliderResponse {
  success: boolean;
  message: string;
  data?: {
    deletedSliderId: number;
    deletedOrderNumber: number;
    remainingSliders: Slider[];
    totalRemaining: number;
  };
}

export const deleteSlider = async (id: number) => {
  const response = await axiosInstance.delete<DeleteSliderResponse>(
    `/sliders/${id}`
  );
  return response.data;
};

export interface BulkDeleteSlidersResponse {
  success: boolean;
  message: string;
  data?: {
    deletedSliderIds: number[];
    deletedOrderNumbers: number[];
    remainingSliders: Slider[];
    totalRemaining: number;
  };
}

export const bulkDeleteSliders = async (ids: number[]) => {
  const response = await axiosInstance.post<BulkDeleteSlidersResponse>(
    "/sliders/bulk-delete",
    {
      ids,
    }
  );
  return response.data;
};
