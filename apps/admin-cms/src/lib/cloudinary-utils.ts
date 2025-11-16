/**
 * Cloudinary Upload Utility Functions
 *
 * This module provides utility functions for uploading files to Cloudinary
 * from the frontend, including direct uploads and server-side uploads.
 */

export interface CloudinaryUploadResponse {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  bytes: number;
  created_at: string;
  folder?: string;
}

export interface CloudinaryUploadOptions {
  folder?: string;
  resourceType?: "image" | "video" | "raw" | "auto";
  transformation?: string;
  tags?: string[];
  context?: Record<string, string>;
  eager?: string;
  quality?: "auto" | number;
  // Note: format parameter is not allowed in unsigned uploads
}

export interface UploadResult {
  success: boolean;
  url?: string;
  publicId?: string;
  width?: number;
  height?: number;
  format?: string;
  size?: number;
  error?: string;
}

/**
 * Upload file directly to Cloudinary using unsigned upload preset
 * This is the recommended approach for frontend uploads
 */
export const uploadToCloudinaryDirect = async (
  file: File,
  options: CloudinaryUploadOptions = {}
): Promise<UploadResult> => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
    );

    // Add optional parameters
    if (options.folder) {
      formData.append("folder", options.folder);
    }
    if (options.resourceType) {
      formData.append("resource_type", options.resourceType);
    }
    if (options.transformation) {
      formData.append("transformation", options.transformation);
    }
    if (options.tags) {
      formData.append("tags", options.tags.join(","));
    }
    if (options.context) {
      Object.entries(options.context).forEach(([key, value]) => {
        formData.append(`context[${key}]`, value);
      });
    }
    if (options.eager) {
      formData.append("eager", options.eager);
    }
    if (options.quality) {
      formData.append("quality", options.quality.toString());
    }
    // Note: format parameter is not allowed in unsigned uploads

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/${
      options.resourceType || "image"
    }/upload`;

    const response = await fetch(uploadUrl, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Upload failed");
    }

    const data: CloudinaryUploadResponse = await response.json();

    return {
      success: true,
      url: data.secure_url,
      publicId: data.public_id,
      width: data.width,
      height: data.height,
      format: data.format,
      size: data.bytes,
    };
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Upload failed",
    };
  }
};

/**
 * Delete image from Cloudinary using public ID
 */
export const deleteFromCloudinary = async (
  publicId: string
): Promise<boolean> => {
  try {
    const response = await fetch("/api/cloudinary/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ publicId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Delete failed");
    }

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    return false;
  }
};

/**
 * Extract public ID from Cloudinary URL
 */
export const extractPublicId = (url: string): string => {
  const regex = /v\d+\/([^\/]+)\/([^\/.]+)/;
  const match = url.match(regex);
  return match ? `${match[1]}/${match[2]}` : "";
};

/**
 * Generate Cloudinary URL with transformations
 */
export const generateCloudinaryUrl = (
  publicId: string,
  transformations?: {
    width?: number;
    height?: number;
    crop?: string;
    quality?: "auto" | number;
    format?: string;
    gravity?: string;
  }
): string => {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  let url = `https://res.cloudinary.com/${cloudName}/image/upload`;

  if (transformations) {
    const transforms = [];

    if (transformations.width) transforms.push(`w_${transformations.width}`);
    if (transformations.height) transforms.push(`h_${transformations.height}`);
    if (transformations.crop) transforms.push(`c_${transformations.crop}`);
    if (transformations.quality)
      transforms.push(`q_${transformations.quality}`);
    if (transformations.format) transforms.push(`f_${transformations.format}`);
    if (transformations.gravity)
      transforms.push(`g_${transformations.gravity}`);

    if (transforms.length > 0) {
      url += `/${transforms.join(",")}`;
    }
  }

  url += `/${publicId}`;
  return url;
};

/**
 * Validate file before upload
 */
export const validateFile = (
  file: File,
  options: {
    maxSize?: number; // in bytes
    acceptedFormats?: string[];
  } = {}
): { isValid: boolean; error?: string } => {
  const {
    maxSize = 5 * 1024 * 1024,
    acceptedFormats = ["image/jpeg", "image/png", "image/webp", "image/gif"],
  } = options;

  // Check file size
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: `File size exceeds ${(maxSize / 1024 / 1024).toFixed(0)}MB limit`,
    };
  }

  // Check file type
  if (!acceptedFormats.includes(file.type)) {
    return {
      isValid: false,
      error: `Invalid file format. Accepted formats: ${acceptedFormats
        .map((f) => f.split("/")[1])
        .join(", ")}`,
    };
  }

  return { isValid: true };
};
