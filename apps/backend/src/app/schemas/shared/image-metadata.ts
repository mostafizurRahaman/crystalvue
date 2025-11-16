import { z } from "zod";

// Image metadata schema for Cloudinary
export const imageMetadataSchema = z.object({
  id: z.string().uuid("Invalid image ID format").optional(),
  url: z.string().url("Invalid image URL"),
  publicId: z.string().optional().default(""),
  folder: z.string().optional().default("app/uploads"),
  altText: z.string().optional(),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
  format: z.string().optional(),
  size: z.number().int().positive().optional(),
});

export type ImageMetadataType = z.infer<typeof imageMetadataSchema>;

// Helper function to create image from metadata
export const createImageFromMetadata = (metadata: ImageMetadataType) => {
  return {
    url: metadata.url,
    publicId: metadata.publicId || "",
    folder: metadata.folder || "app/uploads",
    altText: metadata.altText,
    width: metadata.width,
    height: metadata.height,
    format: metadata.format,
    size: metadata.size,
  };
};

// Helper function to compare if two image metadatas have different URLs
export const hasImageChanged = (oldUrl: string | null | undefined, newMetadata?: ImageMetadataType) => {
  if (!newMetadata && !oldUrl) return false;
  if (!newMetadata && oldUrl) return true;
  if (newMetadata && !oldUrl) return true;
  return oldUrl !== newMetadata?.url;
};
