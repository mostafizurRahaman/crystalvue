import { z } from "zod";

export const updateSettingsSchema = z
  .object({
    siteTitle: z
      .string()
      .min(1, "Site title is required")
      .max(100, "Site title too long (max 100 characters)")
      .transform((val) => val.trim()),
    siteDescription: z
      .string()
      .min(1, "Site description is required")
      .max(500, "Site description too long (max 500 characters)")
      .transform((val) => val.trim()),
    logoImage: z
      .object({
        url: z.string().url("Invalid logo image URL"),
        publicId: z.string().min(1, "Logo image public ID is required"),
        folder: z.string().optional(),
        altText: z.string().optional(),
        width: z.number().int().positive().optional(),
        height: z.number().int().positive().optional(),
        format: z.string().optional(),
        size: z.number().int().positive().optional(),
      }),
    faviconImage: z
      .object({
        url: z.string().url("Invalid favicon image URL"),
        publicId: z.string().min(1, "Favicon image public ID is required"),
        folder: z.string().optional(),
        altText: z.string().optional(),
        width: z.number().int().positive().optional(),
        height: z.number().int().positive().optional(),
        format: z.string().optional(),
        size: z.number().int().positive().optional(),
      }),
    metaImage: z
      .object({
        url: z.string().url("Invalid meta image URL"),
        publicId: z.string().min(1, "Meta image public ID is required"),
        folder: z.string().optional(),
        altText: z.string().optional(),
        width: z.number().int().positive().optional(),
        height: z.number().int().positive().optional(),
        format: z.string().optional(),
        size: z.number().int().positive().optional(),
      }),
    contactEmail: z.string().email("Invalid email format").min(1, "Contact email is required"),
    contactPhone: z.string().min(1, "Phone number is required"),
    contactWhatsApp: z.string().min(1, "WhatsApp number is required"),
    officeAddress: z.string().min(1, "Office address is required"),
    googleMapEmbedCode: z.string().min(1, "Google map embed code is required"),
    socialMediaLinks: z
      .object({
        facebook: z.string().url("Invalid Facebook URL"),
        twitter: z.string().url("Invalid Twitter URL"),
        linkedin: z.string().url("Invalid LinkedIn URL"),
        instagram: z.string().url("Invalid Instagram URL"),
      }),
    businessHours: z.object({
      openingText: z.string().optional(),
      closeText: z.string().optional(),
    }).optional(),
    seoMetaTitle: z.string().min(1, "SEO meta title is required").max(255),
    seoMetaDescription: z.string().min(1, "SEO meta description is required").max(500),
    seoKeywords: z.string().min(1, "SEO keywords are required").max(500),
    isActive: z.boolean(),
  });

export type UpdateSettingsType = z.infer<typeof updateSettingsSchema>;
