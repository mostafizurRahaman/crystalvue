import { z } from "zod";

export const deleteTestimonialParamsSchema = z.object({
  id: z.string().uuid("Invalid testimonial ID format"),
});

export type DeleteTestimonialParamsType = z.infer<typeof deleteTestimonialParamsSchema>;
