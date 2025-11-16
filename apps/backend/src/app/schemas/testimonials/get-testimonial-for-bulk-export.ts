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
    .refine((ids) => Array.isArray(ids) && ids.length > 0, {
      message: "At least one testimonial ID is required",
    }),
});

export type GetBulkTestimonialsQueryType = z.infer<
  typeof getBulkTestimonialsQuerySchema
>;
