"use client";

import { useState, useRef, ChangeEvent, DragEvent, useEffect } from "react";
import { Upload, X, Loader2, User } from "lucide-react";
import { Button } from "../ui/button";
import { toast } from "sonner";
import Image from "next/image";
import {
  uploadToCloudinaryDirect,
  validateFile,
  extractPublicId,
} from "@/lib/cloudinary-utils";
import { deleteCloudinaryImage } from "@/api/upload/delete-image";
import type { ImageMetadata } from "@/types/shared";

interface ProfileImageUploadProps {
  value?: string; // URL of existing image
  publicId?: string; // Public ID of existing image for deletion
  onImageUpload?: (url: string | null, metadata?: ImageMetadata) => void;
  onImageRemove?: () => void;
  disabled?: boolean;
  folder?: string;
  maxSizeMB?: number;
  acceptedFormats?: string[];
  className?: string;
}

export function ProfileImageUpload({
  value,
  publicId,
  onImageUpload,
  onImageRemove,
  disabled = false,
  folder = "profiles",
  maxSizeMB = 5,
  acceptedFormats = ["image/jpeg", "image/png", "image/gif", "image/webp"],
  className = "",
}: ProfileImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(value || null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPublicId, setCurrentPublicId] = useState<string | null>(
    publicId || (value ? extractPublicId(value) : null)
  );

  // Update preview when value prop changes
  useEffect(() => {
    setPreview(value || null);
    // Also update publicId if we have a URL but no publicId prop
    if (value && !publicId) {
      const extractedId = extractPublicId(value);
      if (extractedId) {
        setCurrentPublicId(extractedId);
      }
    }
  }, [value, publicId]);

  // Update currentPublicId when publicId prop changes
  useEffect(() => {
    setCurrentPublicId(publicId || null);
  }, [publicId]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection and immediate upload
  const handleFileSelect = async (file: File) => {
    if (disabled) return;

    // Validate file
    const validation = validateFile(file, {
      maxSize: maxSizeMB * 1024 * 1024,
      acceptedFormats,
    });

    if (!validation.isValid) {
      setError(validation.error || "Invalid file");
      toast.error(validation.error || "Invalid file selected");
      return;
    }

    setError(null);
    setPreview(URL.createObjectURL(file));

    // Upload immediately like single-image-uploader
    await handleCloudinaryUpload(file);
  };

  // Handle file change from input
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  // Handle drag events
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (disabled) return;

    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find((file) => file.type.startsWith("image/"));

    if (imageFile) {
      handleFileSelect(imageFile);
    } else {
      setError("Please drop an image file");
      toast.error("Please drop an image file");
    }
  };

  // Handle Cloudinary upload (like single-image-uploader)
  const handleCloudinaryUpload = async (file: File) => {
    setIsProcessing(true);
    setError(null);

    try {
      // Delete existing image if there's one
      if (currentPublicId) {
        try {
          await deleteCloudinaryImage(currentPublicId);
        } catch (error) {
          console.warn("Failed to delete existing image:", error);
        }
      }

      // Upload new image using the same API structure as single-image-uploader
      const result = await uploadToCloudinaryDirect(file, { folder });

      if (result.success && result.url && result.publicId) {
        setPreview(result.url);
        setCurrentPublicId(result.publicId);

        const metadata: ImageMetadata = {
          url: result.url,
          publicId: result.publicId,
          folder: folder,
          altText: file.name,
          width: result.width,
          height: result.height,
          format: result.format,
          size: result.size,
        };

        onImageUpload?.(result.url, metadata);
        toast.success("Profile image uploaded successfully");
      } else {
        throw new Error(result.error || "Upload failed");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to upload image";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle remove image (like single-image-uploader)
  const handleRemoveImage = async () => {
    if (disabled || isProcessing) return;

    setIsProcessing(true);

    try {
      // If we have a publicId, delete from Cloudinary first
      if (currentPublicId) {
        toast.loading("Removing image...");
        await deleteCloudinaryImage(currentPublicId);
        toast.dismiss();
        toast.success("Image removed successfully");
      } else {
        toast.success("Image removed successfully");
      }

      // Only clear state after successful deletion
      setPreview(null);
      setError(null);
      setCurrentPublicId(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // Use null instead of undefined for React Hook Form
      onImageUpload?.(null);
      onImageRemove?.();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to remove image";
      toast.error(errorMessage);
      // Don't clear state if deletion failed
      console.error("Failed to delete from Cloudinary:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle click on upload area
  const handleClick = () => {
    if (!disabled && !isProcessing) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Main upload area */}
      <div className=" flex gap-5 items-center space-y-3">
        <div
          className={`
            relative w-24 h-24 rounded-full overflow-hidden border-2 border-dashed transition-all cursor-pointer
            ${
              isDragging
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 hover:border-gray-400 bg-gray-50"
            }
            ${disabled ? "opacity-50 cursor-not-allowed" : ""}
            ${error ? "border-red-500 bg-red-50" : ""}
          `}
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {preview ? (
            <Image
              src={preview}
              alt="Profile preview"
              fill
              className="object-cover"
              sizes="96px"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full bg-muted">
              <User className="w-8 h-8 text-muted-foreground" />
            </div>
          )}

          {/* Processing overlay */}
          {isProcessing && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-white" />
            </div>
          )}
        </div>

        {/* Upload button - only show when no image is selected */}
        {!preview && !disabled && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleClick}
            disabled={isProcessing}
            className="relative"
          >
            <Upload className="w-4 h-4 mr-2" />
            Choose Photo
          </Button>
        )}

        {/* Action buttons when image exists */}
        {preview && !disabled && (
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleClick}
              disabled={isProcessing}
            >
              <Upload className="w-4 h-4 mr-2" />
              Change Photo
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleRemoveImage}
              disabled={isProcessing}
              className="text-destructive hover:text-destructive"
            >
              <X className="w-4 h-4 mr-2" />
              Remove
            </Button>
          </div>
        )}

        {/* Error display */}
        {error && (
          <p className="text-sm text-destructive text-center">{error}</p>
        )}

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedFormats.join(",")}
          onChange={handleFileChange}
          className="hidden"
          disabled={disabled}
        />
      </div>
    </div>
  );
}
