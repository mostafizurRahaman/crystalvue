import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createContactUsForm, ContactFormData } from "@/api";
import { toast } from "sonner";

export const useContactForm = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: ContactFormData) => createContactUsForm(formData),
    onSuccess: (data) => {
      toast.success(data.message || "Form submitted successfully!");
      // Invalidate any relevant queries if needed
      queryClient.invalidateQueries({ queryKey: ["contact"] });
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || error.message || "Failed to submit form";
      toast.error(errorMessage);
    },
    onSettled: () => {
      // Optional: add any cleanup logic here
    },
  });
};
