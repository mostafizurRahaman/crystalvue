import axiosInstance from "@/configs/axios";
import { UpdateSliderFormData, Slider } from "@/schemas/sliders";

export interface UpdateSliderResponse {
  success: boolean;
  message: string;
  data?: {
    updatedSlider: Slider;
    allSliders: Slider[];
    totalCount: number;
  };
}

export const updateSlider = async (id: number, data: UpdateSliderFormData) => {
  const response = await axiosInstance.patch<UpdateSliderResponse>(
    `/sliders/${id}`,
    data
  );
  return response.data;
};
