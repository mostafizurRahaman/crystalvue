import { useQuery } from "@tanstack/react-query";
import { Slider, getAllSliders, GetAllSlidersParams } from "@/api";

export const useSliders = (params?: GetAllSlidersParams) => {
  return useQuery<Slider[], Error>({
    queryKey: ["sliders", params],
    queryFn: () => getAllSliders(params).then(response => response.data || []),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 3,
  });
};
