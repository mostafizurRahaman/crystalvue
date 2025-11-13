import { z } from "zod";

// Helper function to create better error messages
const createErrorMessages = {
  required: (field: string) => `${field.charAt(0).toUpperCase() + field.slice(1)} is required`,
  maxLength: (field: string, max: number) => `${field.charAt(0).toUpperCase() + field.slice(1)} must be ${max} characters or less`,
  minLength: (field: string, min: number) => `${field.charAt(0).toUpperCase() + field.slice(1)} must be at least ${min} characters`,
  email: "Please enter a valid email address",
  url: "Please enter a valid URL (e.g., https://example.com)",
  number: "Please enter a valid number",
  positive: "Please enter a positive number",
};

export const updateSettingsSchema = z.object({
  siteTitle: z.string()
    .trim()
    .min(1, { message: createErrorMessages.required("site title") })
    .max(100, { message: createErrorMessages.maxLength("site title", 100) }),
  siteDescription: z.string()
    .trim()
    .min(1, { message: createErrorMessages.required("site description") })
    .max(500, { message: createErrorMessages.maxLength("site description", 500) }),
  logoImage: z.object({
    url: z.string().url({ message: createErrorMessages.url }),
    publicId: z.string().min(1, { message: createErrorMessages.required("image public ID") }),
    folder: z.string().optional(),
    altText: z.string().trim().optional(),
    width: z.number()
      .int({ message: createErrorMessages.number })
      .positive({ message: createErrorMessages.positive })
      .optional(),
    height: z.number()
      .int({ message: createErrorMessages.number })
      .positive({ message: createErrorMessages.positive })
      .optional(),
    format: z.string().optional(),
    size: z.number()
      .int({ message: createErrorMessages.number })
      .positive({ message: createErrorMessages.positive })
      .optional(),
  }).optional(),
  faviconImage: z.object({
    url: z.string().url({ message: createErrorMessages.url }),
    publicId: z.string().min(1, { message: createErrorMessages.required("image public ID") }),
    folder: z.string().optional(),
    altText: z.string().trim().optional(),
    width: z.number()
      .int({ message: createErrorMessages.number })
      .positive({ message: createErrorMessages.positive })
      .optional(),
    height: z.number()
      .int({ message: createErrorMessages.number })
      .positive({ message: createErrorMessages.positive })
      .optional(),
    format: z.string().optional(),
    size: z.number()
      .int({ message: createErrorMessages.number })
      .positive({ message: createErrorMessages.positive })
      .optional(),
  }).optional(),
  metaImage: z.object({
    url: z.string().url({ message: createErrorMessages.url }),
    publicId: z.string().min(1, { message: createErrorMessages.required("image public ID") }),
    folder: z.string().optional(),
    altText: z.string().trim().optional(),
    width: z.number()
      .int({ message: createErrorMessages.number })
      .positive({ message: createErrorMessages.positive })
      .optional(),
    height: z.number()
      .int({ message: createErrorMessages.number })
      .positive({ message: createErrorMessages.positive })
      .optional(),
    format: z.string().optional(),
    size: z.number()
      .int({ message: createErrorMessages.number })
      .positive({ message: createErrorMessages.positive })
      .optional(),
  }).optional(),
  contactEmail: z.string()
    .trim()
    .min(1, { message: createErrorMessages.required("email address") })
    .email({ message: createErrorMessages.email }),
  contactPhone: z.string()
    .trim()
    .min(1, { message: createErrorMessages.required("phone number") }),
  contactWhatsApp: z.string()
    .trim()
    .optional(),
  officeAddress: z.string()
    .trim()
    .min(1, { message: createErrorMessages.required("office address") }),
  googleMapEmbedCode: z.string()
    .trim()
    .optional(),
  socialMediaLinks: z.object({
    facebook: z.string()
      .trim()
      .url({ message: createErrorMessages.url })
      .or(z.literal("")),
    twitter: z.string()
      .trim()
      .url({ message: createErrorMessages.url })
      .or(z.literal("")),
    linkedin: z.string()
      .trim()
      .url({ message: createErrorMessages.url })
      .or(z.literal("")),
    instagram: z.string()
      .trim()
      .url({ message: createErrorMessages.url })
      .or(z.literal("")),
  }),
  businessHours: z.object({
    openingText: z.string().optional(),
    closeText: z.string().optional(),
  }).optional(),
  seoMetaTitle: z.string()
    .trim()
    .min(1, { message: createErrorMessages.required("SEO meta title") })
    .max(255, { message: createErrorMessages.maxLength("SEO meta title", 255) }),
  seoMetaDescription: z.string()
    .trim()
    .min(1, { message: createErrorMessages.required("SEO meta description") })
    .max(500, { message: createErrorMessages.maxLength("SEO meta description", 500) }),
  seoKeywords: z.string()
    .trim()
    .min(1, { message: createErrorMessages.required("SEO keywords") })
    .max(500, { message: createErrorMessages.maxLength("SEO keywords", 500) }),
  isActive: z.boolean(),
});

export type UpdateSettingsType = z.infer<typeof updateSettingsSchema>;
