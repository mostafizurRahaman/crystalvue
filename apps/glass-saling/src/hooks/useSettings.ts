import { useQuery } from "@tanstack/react-query";
import { getSettings, GlobalSettings } from "@/api";

export const useSettings = () => {
  return useQuery<GlobalSettings, Error>({
    queryKey: ["settings"],
    queryFn: () => getSettings(),
    staleTime: 1000 * 60 * 10, // 10 minutes
    retry: 3,
  });
};
