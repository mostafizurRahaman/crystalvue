import { z } from "zod";

export const updateTestimonialParamsSchema = z.object({
  id: z.string().uuid("Invalid testimonial ID format"),
});

export const updateTestimonialSchema = z
  .object({
    name: z
      .string()
      .min(1, "Name is required")
      .max(255, "Name too long (max 255 characters)")
      .transform((val) => val.trim())
      .optional(),
    message: z
      .string()
      .min(1, "Message is required")
      .max(1000, "Message too long (max 1000 characters)")
      .transform((val) => val.trim())
      .optional(),
    rating: z
      .number()
      .int("Rating must be an integer")
      .min(1, "Rating must be at least 1")
      .max(5, "Rating cannot exceed 5")
      .optional(),
    position: z
      .string()
      .max(255, "Position too long (max 255 characters)")
      .transform((val) => val.trim())
      .optional(),
    company: z
      .string()
      .max(255, "Company name too long (max 255 characters)")
      .transform((val) => val.trim())
      .optional(),
    image: z
      .object({
        url: z.string().url("Invalid image URL"),
        publicId: z.string().min(1, "Image public ID is required"),
        folder: z.string().optional(),
        altText: z.string().optional(),
        width: z.number().int().positive().optional(),
        height: z.number().int().positive().optional(),
        format: z.string().optional(),
        size: z.number().int().positive().optional(),
      })
      .optional(),
    isActive: z.boolean().optional(),
  })
  .refine(
    (data) => {
      // At least one field must be provided for update
      return Object.keys(data).length > 0;
    },
    {
      message: "At least one field must be provided for update",
    },
  );

export type UpdateTestimonialType = z.infer<typeof updateTestimonialSchema>;
export type UpdateTestimonialParamsType = z.infer<
  typeof updateTestimonialParamsSchema
>;
