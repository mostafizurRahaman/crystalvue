import { v2 as cloudinary } from "cloudinary";
import { env } from "../configs/env";

// --- 1. Configure Cloudinary SDK ---
cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
  secure: true,
});

console.log("Cloudinary configuration loaded.");

/**
 * Deletes an asset from Cloudinary using its public ID.
 * @param {string} publicId - The public ID of the asset to delete.
 * @param {'image' | 'video' | 'raw'} resourceType - The type of resource to delete.
 * @returns {Promise<object>} The result from the Cloudinary API.
 */
export const deleteFromCloudinaryByPublicId = async (
  publicId: string,
  resourceType: "image" | "video" | "raw" = "image",
) => {
  if (!publicId) {
    throw new Error("Public ID is required to delete an asset.");
  }

  try {
    // The uploader.destroy method handles deleting images, videos, or raw files.
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
      invalidate: true,
    });

    // Cloudinary's destroy method returns { result: 'ok' } on success
    // or { result: 'not found' } if the public_id doesn't exist.
    if (result.result !== "ok" && result.result !== "not found") {
      // This handles any other unexpected response from Cloudinary.
      throw new Error(`Unexpected response from Cloudinary: ${result.result}`);
    }

    return result;
  } catch (error) {
    console.error(`Cloudinary API error while deleting ${publicId}:`, error);
    // Re-throw the error to be caught by the route handler's catch block.
    throw new Error(
      `Failed to delete asset from Cloudinary. Reason: ${
        (error as Error).message
      }`,
    );
  }
};
