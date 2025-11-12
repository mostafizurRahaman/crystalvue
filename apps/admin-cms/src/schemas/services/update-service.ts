import { z } from "zod";
import { imageMetadataSchema } from "./create-service";

export const updateServiceSchema = z
  .object({
    parentCategoryId: z
      .string({
        error: "Category ID is required",
      })
      .uuid("Invalid category ID format"),
    name: z
      .string()
      .min(1, "Name is required")
      .max(100, "Name too long (max 100 chars)")
      .transform((val) => val.trim()),
    tagline: z
      .string()
      .max(255, "Tagline too long (max 255 chars)")
      .transform((val) => val.trim()),
    description: z
      .string()
      .max(1000, "Description too long (max 1000 chars)")
      .transform((val) => val.trim()),
    image: imageMetadataSchema,
    price: z
      .union([
        z.number(),
        z.string().transform((val) => {
          const num = Number(val);
          if (Number.isNaN(num)) {
            throw new Error("Price must be a valid number");
          }
          return num;
        }),
      ])
      .refine((val) => typeof val === "number" && val > 0, {
        message: "Price must be positive",
      })
      .optional(),
    isPremium: z.boolean().optional(),
    isActive: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  });

export type UpdateServiceSchemaType = z.infer<typeof updateServiceSchema>;
