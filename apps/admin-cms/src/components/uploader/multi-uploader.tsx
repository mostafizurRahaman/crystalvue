import { useState, useRef, ChangeEvent, DragEvent } from "react";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Image from "next/image";
import {
  uploadToCloudinaryDirect,
  validateFile,
  deleteFromCloudinary,
} from "@/lib/cloudinary-utils";
import type { ImageMetadata } from "@/types/shared";

interface ImageFile {
  file: File;
  preview: string;
  id: string;
  cloudinaryUrl?: string;
  metadata?: ImageMetadata;
  isUploading?: boolean;
  uploadError?: string;
}

interface MultipleImageUploadProps {
  onImagesChange?: (files: File[]) => void;
  onImagesUpload?: (urls: string[], metadata: ImageMetadata[]) => void;
  maxSizeMB?: number;
  maxFiles?: number;
  acceptedFormats?: string[];
  folder?: string;
  disabled?: boolean;
  uploadMethod?: "cloudinary" | "file";
}

export function MultipleImageUpload({
  onImagesChange,
  onImagesUpload,
  maxSizeMB = 5,
  maxFiles = 10,
  acceptedFormats = ["image/jpeg", "image/png", "image/gif", "image/webp"],
  folder = "uploads",
  disabled = false,
  uploadMethod = "cloudinary",
}: MultipleImageUploadProps) {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFileLocal = (file: File): string | null => {
    if (!acceptedFormats.includes(file.type)) {
      return `Invalid file type: ${file.name}`;
    }

    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return `File too large: ${file.name} (max ${maxSizeMB}MB)`;
    }

    return null;
  };

  const uploadToCloudinary = async (
    file: File
  ): Promise<{
    success: boolean;
    url?: string;
    metadata?: ImageMetadata;
    error?: string;
  }> => {
    try {
      // Validate file using utility function
      const validation = validateFile(file, {
        maxSize: maxSizeMB * 1024 * 1024,
        acceptedFormats,
      });

      if (!validation.isValid) {
        return { success: false, error: validation.error || "Invalid file" };
      }

      // Upload to Cloudinary
      const result = await uploadToCloudinaryDirect(file, {
        folder,
        resourceType: "image",
        quality: "auto",
      });

      if (result.success && result.url) {
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

        return { success: true, url: result.url, metadata };
      } else {
        return { success: false, error: result.error || "Upload failed" };
      }
    } catch (error) {
      console.error("Upload error:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to upload image",
      };
    }
  };

  const handleFiles = async (fileList: FileList) => {
    setError(null);
    const newFiles: ImageFile[] = [];
    const errors: string[] = [];

    const remainingSlots = maxFiles - images.length;
    const filesToProcess = Array.from(fileList).slice(0, remainingSlots);

    if (fileList.length > remainingSlots) {
      setError(
        `Maximum ${maxFiles} files allowed. Only first ${remainingSlots} will be added.`
      );
    }

    if (uploadMethod === "cloudinary") {
      setIsUploading(true);
      const uploadPromises: Promise<void>[] = [];
      const uploadedUrls: string[] = [];
      const uploadedMetadata: ImageMetadata[] = [];

      filesToProcess.forEach((file) => {
        const imageId = `${Date.now()}-${Math.random()}`;

        // Create preview first
        const reader = new FileReader();
        reader.onloadend = () => {
          const imageFile: ImageFile = {
            file,
            preview: reader.result as string,
            id: imageId,
            isUploading: true,
          };

          setImages((prev) => [...prev, imageFile]);
        };
        reader.readAsDataURL(file);

        // Upload to Cloudinary
        const uploadPromise = uploadToCloudinary(file).then((result) => {
          setImages((prev) =>
            prev.map((img) =>
              img.id === imageId
                ? {
                    ...img,
                    isUploading: false,
                    cloudinaryUrl: result.success ? result.url : undefined,
                    metadata: result.success ? result.metadata : undefined,
                    uploadError: result.success ? undefined : result.error,
                  }
                : img
            )
          );

          if (result.success && result.url && result.metadata) {
            uploadedUrls.push(result.url);
            uploadedMetadata.push(result.metadata);
          } else if (result.error) {
            errors.push(result.error);
          }
        });

        uploadPromises.push(uploadPromise);
      });

      try {
        await Promise.all(uploadPromises);

        if (uploadedUrls.length > 0) {
          onImagesUpload?.(uploadedUrls, uploadedMetadata);
          toast.success(
            `${uploadedUrls.length} image(s) uploaded successfully`
          );
        }

        if (errors.length > 0) {
          setError(errors.join(", "));
          toast.error(`${errors.length} upload(s) failed`);
        }
      } catch (error) {
        console.error("Upload batch error:", error);
        toast.error("Some uploads failed");
      } finally {
        setIsUploading(false);
      }
    } else {
      // File-only mode (original behavior)
      let processedCount = 0;

      filesToProcess.forEach((file) => {
        const validationError = validateFileLocal(file);
        if (validationError) {
          errors.push(validationError);
          processedCount++;
          if (processedCount === filesToProcess.length) {
            finishProcessing();
          }
          return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
          newFiles.push({
            file,
            preview: reader.result as string,
            id: `${Date.now()}-${Math.random()}`,
          });
          processedCount++;

          if (processedCount === filesToProcess.length) {
            finishProcessing();
          }
        };
        reader.readAsDataURL(file);
      });

      function finishProcessing() {
        if (errors.length > 0) {
          setError(errors.join(", "));
        }

        if (newFiles.length > 0) {
          setImages((prev) => {
            const updated = [...prev, ...newFiles];
            onImagesChange?.(updated.map((img) => img.file));
            return updated;
          });
        }
      }
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
  };

  const handleRemove = async (id: string) => {
    const imageToRemove = images.find((img) => img.id === id);

    // If we have a Cloudinary URL, try to delete from Cloudinary
    if (
      imageToRemove?.cloudinaryUrl &&
      imageToRemove.cloudinaryUrl.includes("cloudinary.com")
    ) {
      try {
        // Extract public ID from URL for deletion
        const publicId = imageToRemove.cloudinaryUrl
          .split("/")
          .slice(-2)
          .join("/")
          .split(".")[0];
        if (publicId) {
          await deleteFromCloudinary(publicId);
        }
      } catch (error) {
        console.warn("Failed to delete from Cloudinary:", error);
        // Don't show error to user as the image is still removed from UI
      }
    }

    setImages((prev) => {
      const updated = prev.filter((img) => img.id !== id);
      onImagesChange?.(updated.map((img) => img.file));

      // Update upload callback with remaining URLs and metadata
      if (uploadMethod === "cloudinary") {
        const remainingUrls = updated
          .filter((img) => img.cloudinaryUrl)
          .map((img) => img.cloudinaryUrl!);
        const remainingMetadata = updated
          .filter((img) => img.metadata)
          .map((img) => img.metadata!);
        onImagesUpload?.(remainingUrls, remainingMetadata);
      }

      return updated;
    });
    setError(null);
  };

  const handleClick = () => {
    if (images.length < maxFiles && !disabled && !isUploading) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedFormats.join(",")}
        onChange={handleFileChange}
        multiple
        disabled={disabled || isUploading}
        className="hidden"
      />

      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-colors duration-200
          ${
            images.length >= maxFiles || disabled || isUploading
              ? "border-gray-200 bg-gray-100 cursor-not-allowed opacity-60"
              : isDragging
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 hover:border-gray-400 bg-gray-50"
          }
        `}
      >
        <div className="flex flex-col items-center gap-3">
          <div className="p-3 bg-white rounded-full">
            {isUploading ? (
              <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
            ) : (
              <Upload className="w-8 h-8 text-gray-400" />
            )}
          </div>
          <div>
            <p className="text-gray-700">
              {isUploading ? (
                <span>Uploading images...</span>
              ) : images.length >= maxFiles ? (
                <span>Maximum files reached</span>
              ) : (
                <>
                  <span className="text-blue-600">Click to upload</span> or drag
                  and drop
                </>
              )}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {acceptedFormats
                .map((f) => f.split("/")[1].toUpperCase())
                .join(", ")}{" "}
              (max {maxSizeMB}MB each, {maxFiles} files total)
            </p>
          </div>
        </div>
      </div>

      {error && <p className="text-red-600 text-sm mt-2">{error}</p>}

      {images.length > 0 && (
        <div className="mt-4">
          <div className="flex items-center gap-2 mb-3">
            <ImageIcon className="w-5 h-5 text-gray-600" />
            <p className="text-gray-700">
              {images.length} {images.length === 1 ? "file" : "files"} selected
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {images.map((image) => (
              <div
                key={image.id}
                className="relative group rounded-lg overflow-hidden border border-gray-200 aspect-square"
              >
                <div className="relative w-full h-full">
                  <Image
                    src={image.preview}
                    alt={image.file.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                  />
                </div>

                {/* Upload progress overlay */}
                {image.isUploading && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="w-6 h-6 text-white animate-spin" />
                      <p className="text-white text-xs">Uploading...</p>
                    </div>
                  </div>
                )}

                {/* Upload error overlay */}
                {image.uploadError && (
                  <div className="absolute inset-0 bg-red-500/80 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-2 p-2">
                      <X className="w-6 h-6 text-white" />
                      <p className="text-white text-xs text-center">
                        Upload failed
                      </p>
                    </div>
                  </div>
                )}

                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-200">
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(image.id);
                    }}
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    disabled={disabled || isUploading}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <p className="text-white text-xs truncate">
                    {image.file.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
