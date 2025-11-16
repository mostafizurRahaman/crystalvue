import axiosInstance from "@/configs/axios";

export interface SwapSliderResponse {
  success: boolean;
  message: string;
  data?: {
    swapped: {
      slider1: { id: number; newOrder: number };
      slider2: { id: number; newOrder: number };
    };
  };
}

export const swapSlider = async (id1: number, id2: number) => {
  const response = await axiosInstance.put<SwapSliderResponse>(
    "/sliders/swap",
    {
      sliderId1: id1,
      sliderId2: id2,
    }
  );
  return response.data;
};
