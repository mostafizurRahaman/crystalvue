import { z } from "zod";

export const getBulkTestimonialsQuerySchema = z.object({
  ids: z
    .string({ error: "Testimonial IDs are required" })
    .transform((val) =>
      val
        .split(",")
        .map((id) => id.trim())
        .filter(Boolean)
    )
    .refine((ids) => ids.length > 0, {
      message: "At least one testimonial ID is required",
    }),
  search: z
    .string()
    .transform((val) => val.trim())
    .optional(),
  rating: z.coerce.number().int().min(1).max(5).optional(),
  isActive: z
    .string()
    .transform((val) => val === "true")
    .pipe(z.boolean())
    .optional(),
});

export type GetBulkTestimonialsQueryType = z.infer<
  typeof getBulkTestimonialsQuerySchema
>;

export interface GetBulkTestimonialsByIdsRequest {
  ids: string[]; // Array of IDs for frontend convenience
  search?: string;
  rating?: number;
  isActive?: boolean;
}
