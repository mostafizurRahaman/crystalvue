import { useQuery } from "@tanstack/react-query";
import { getAllCategories, Category, GetAllCategoriesParams } from "@/api";

export const useCategories = (params?: GetAllCategoriesParams) => {
  return useQuery({
    queryKey: ["categories", params],
    queryFn: () => getAllCategories(params),
    staleTime: 1000 * 60 * 10, // 10 minutes
    retry: 3,
  });
};
