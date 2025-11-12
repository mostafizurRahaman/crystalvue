import axiosInstance from "@/configs/axios";
import { Slider } from "@/schemas/sliders";

export interface GetSliderByIdResponse {
  success: boolean;
  message: string;
  data: Slider;
}

export const getSliderById = async (id: number): Promise<Slider> => {
  const response = await axiosInstance.get<GetSliderByIdResponse>(
    `/sliders/${id}`
  );
  return response.data.data;
};
