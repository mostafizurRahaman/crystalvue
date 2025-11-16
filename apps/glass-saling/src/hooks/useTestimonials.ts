import { useQuery } from "@tanstack/react-query";
import { 
  getTestimonials, 
  Testimonial, 
  GetAllTestimonialsParams 
} from "@/api";

export const useTestimonials = (params?: GetAllTestimonialsParams) => {
  return useQuery<Testimonial[], Error>({
    queryKey: ["testimonials", params],
    queryFn: () => getTestimonials(params),
    staleTime: 1000 * 60 * 15, // 15 minutes
    retry: 3,
  });
};
