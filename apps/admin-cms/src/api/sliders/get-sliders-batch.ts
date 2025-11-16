import axiosInstance from "@/configs/axios";
import { Slider } from "@/schemas/sliders";

export const getSlidersBatch = async (ids: number[]) => {
  if (ids.length === 0) {
    return [];
  }

  // Use batching for efficiency
  const BATCH_SIZE = 50;
  const results: Slider[] = [];

  // Process in batches
  for (let i = 0; i < ids.length; i += BATCH_SIZE) {
    const batchIds = ids.slice(i, i + BATCH_SIZE);

    const response = await axiosInstance.get<{
      success: boolean;
      message: string;
      data: Slider[];
    }>("/sliders/batch", {
      params: {
        ids: batchIds.join(","),
      },
    });

    if (response.data.success && Array.isArray(response.data.data)) {
      results.push(...response.data.data);
    }
  }

  return results;
};

export const getSlidersBatchPost = async (ids: number[]) => {
  if (ids.length === 0) {
    return [];
  }

  const response = await axiosInstance.post<{
    success: boolean;
    message: string;
    data: Slider[];
  }>("/sliders/batch", {
    ids,
  });

  if (response.data.success && Array.isArray(response.data.data)) {
    return response.data.data;
  }

  return [];
};
