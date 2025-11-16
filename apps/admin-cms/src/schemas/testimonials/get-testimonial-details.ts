import { z } from "zod";

export const getTestimonialDetailsParamsSchema = z.object({
  id: z.string().uuid("Invalid testimonial ID format"),
});

export type GetTestimonialDetailsParamsType = z.infer<
  typeof getTestimonialDetailsParamsSchema
>;
