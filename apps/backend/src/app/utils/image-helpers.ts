import { Prisma, PrismaClient } from "@prisma/client";
import { db } from "../db";
import { ImageMetadataType } from "../schemas/shared/image-metadata";

// Helper function to create image record
export const createImageRecord = async (
  metadata: ImageMetadataType,
  tx?: Prisma.TransactionClient
): Promise<{ id: string }> => {
  const client = tx || db;
  
  const image = await client.image.create({
    data: {
      url: metadata.url,
      publicId: metadata.publicId || "",
      folder: metadata.folder || "app/uploads",
      altText: metadata.altText,
      width: metadata.width,
      height: metadata.height,
      format: metadata.format,
      size: metadata.size,
    },
    select: { id: true }
  });

  return image;
};

// Helper function to update image record
export const updateImageRecord = async (
  imageId: string,
  metadata: ImageMetadataType,
  tx?: Prisma.TransactionClient
): Promise<{ id: string }> => {
  const client = tx || db;
  
  const image = await client.image.update({
    where: { id: imageId },
    data: {
      url: metadata.url,
      publicId: metadata.publicId || "",
      folder: metadata.folder || "app/uploads",
      altText: metadata.altText,
      width: metadata.width,
      height: metadata.height,
      format: metadata.format,
      size: metadata.size,
    },
    select: { id: true }
  });

  return image;
};

// Helper function to handle image creation/update logic
export const handleImageSave = async (
  oldImageId: string | null | undefined,
  newMetadata: ImageMetadataType | undefined,
  tx?: Prisma.TransactionClient
): Promise<string | null> => {
  if (!newMetadata) {
    // No new image provided, keep old one or return null
    return oldImageId || null;
  }

  if (newMetadata.id) {
    // Update existing image
    if (oldImageId && newMetadata.id === oldImageId) {
      await updateImageRecord(newMetadata.id, newMetadata, tx);
      return newMetadata.id;
    }
    // Different image ID provided, but we should use the new one
    await updateImageRecord(newMetadata.id, newMetadata, tx);
    return newMetadata.id;
  }

  // Create new image
  const newImage = await createImageRecord(newMetadata, tx);
  return newImage.id;
};
