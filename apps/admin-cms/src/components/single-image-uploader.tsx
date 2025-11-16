"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { X, Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import {
  uploadToCloudinaryDirect,
  validateFile,
  deleteFromCloudinary,
} from "@/lib/cloudinary-utils";

// ✅ Fixed interface with folder property
export interface ImageMetadata {
  publicId?: string;
  folder?: string;
  altText?: string;
  width?: number;
  height?: number;
  format?: string;
  size?: number;
}

interface SingleImageUploadProps {
  value?: string;
  onChange: (url: string | null, metadata?: ImageMetadata) => void;
  folder?: string;
  disabled?: boolean;
  maxSize?: number; // in bytes
  acceptedFormats?: string[];
  uploadMethod?: "direct"; // Direct Cloudinary upload using unsigned preset
}

const SingleImageUpload: React.FC<SingleImageUploadProps> = ({
  value,
  onChange,
  folder = "uploads",
  disabled = false,
  maxSize = 5 * 1024 * 1024, // 5MB default
  acceptedFormats = ["image/jpeg", "image/png", "image/webp", "image/gif"],
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(value || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file using utility function
    const validation = validateFile(file, {
      maxSize,
      acceptedFormats,
    });

    if (!validation.isValid) {
      toast.error(validation.error || "Invalid file");
      return;
    }

    setIsUploading(true);

    try {
      // Direct upload to Cloudinary
      const result = await uploadToCloudinaryDirect(file, {
        folder,
        resourceType: "image",
        quality: "auto",
      });

      if (result.success && result.url) {
        setPreview(result.url);
        onChange(result.url, {
          publicId: result.publicId,
          folder: folder,
          altText: file.name,
          width: result.width,
          height: result.height,
          format: result.format,
          size: result.size,
        });
        toast.success("Image uploaded successfully");
      } else {
        throw new Error(result.error || "Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to upload image"
      );
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemove = async () => {
    // If we have a publicId, try to delete from Cloudinary
    if (value && value.includes("cloudinary.com")) {
      try {
        // Extract public ID from URL for deletion
        const publicId = value.split("/").slice(-2).join("/").split(".")[0];
        if (publicId) {
          await deleteFromCloudinary(publicId);
        }
      } catch (error) {
        console.warn("Failed to delete from Cloudinary:", error);
        // Don't show error to user as the image is still removed from UI
      }
    }

    setPreview(null);
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedFormats.join(",")}
        onChange={handleFileSelect}
        disabled={disabled || isUploading}
        className="hidden"
      />

      {preview ? (
        <div className="relative inline-block">
          <div className="relative w-full max-w-md h-64 rounded-lg overflow-hidden border border-gray-200">
            <Image
              src={preview}
              alt="Preview"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={handleRemove}
            disabled={disabled || isUploading}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
          onClick={handleClick}
        >
          {isUploading ? (
            <div className="flex flex-col items-center justify-center space-y-2">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              <p className="text-sm text-gray-500">Uploading...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-2">
              <Upload className="h-8 w-8 text-gray-400" />
              <p className="text-sm text-gray-600">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-gray-500">
                {acceptedFormats.map((f) => f.split("/")[1]).join(", ")} (max{" "}
                {(maxSize / 1024 / 1024).toFixed(0)}MB)
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SingleImageUpload;
