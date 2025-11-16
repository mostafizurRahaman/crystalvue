import { z } from "zod";
import { imageMetadataSchema } from "./create-testimonial";

export const updateTestimonialParamsSchema = z.object({
  id: z.string().uuid("Invalid testimonial ID format"),
});

export const updateTestimonialSchema = z
  .object({
    name: z
      .string()
      .min(1, "Name is required")
      .max(255, "Name too long (max 255 characters)")
      .transform((val) => val.trim()),

    message: z
      .string()
      .min(1, "Message is required")
      .max(1000, "Message too long (max 1000 characters)")
      .transform((val) => val.trim()),
    rating: z
      .number()
      .int("Rating must be an integer")
      .min(1, "Rating must be at least 1")
      .max(5, "Rating cannot exceed 5")
      .optional(),
    position: z
      .string()
      .max(255, "Position too long (max 255 characters)")
      .transform((val) => val.trim()),
    company: z
      .string()
      .max(255, "Company name too long (max 255 characters)")
      .transform((val) => val.trim()),
    image: imageMetadataSchema,
    isActive: z.boolean().optional().default(true),
  })
  .refine(
    (data) => {
      // At least one field must be provided for update
      return Object.keys(data).length > 0;
    },
    {
      message: "At least one field must be provided for update",
    }
  );

export type UpdateTestimonialSchemaType = z.infer<
  typeof updateTestimonialSchema
>;
export type UpdateTestimonialParamsType = z.infer<
  typeof updateTestimonialParamsSchema
>;
