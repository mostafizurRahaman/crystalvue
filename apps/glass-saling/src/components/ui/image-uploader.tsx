import { useState, useRef, ChangeEvent, DragEvent } from "react";
import { Upload, X } from "lucide-react";
import { Button } from "../ui/button";
import { Typography } from "../typography";
import { toast } from "sonner";
import Image from "next/image";
import { Skeleton } from "../ui/skeleton";
import { uploadToCloudinaryDirect, validateFile } from "@/lib/cloudinary-utils";
import { deleteCloudinaryImage } from "@/api/upload/delete-image";

// Image metadata interface
export interface ImageMetadata {
  id: string;
  url: string;
  publicId: string;
  altText?: string;
  width?: number;
  height?: number;
  format?: string;
  size?: number;
  folder?: string;
}

interface MultipleImageUploadProps {
  onImagesChange?: (images: ImageMetadata[]) => void;
  initialImages?: ImageMetadata[];
  maxImages?: number;
  maxSizeMB?: number;
  acceptedFormats?: string[];
  folder?: string;
  disabled?: boolean;
  title?: string;
  description?: string;
}

export function MultipleImageUpload({
  onImagesChange,
  initialImages = [],
  maxImages = 5,
  maxSizeMB = 5,
  acceptedFormats = ["image/jpeg", "image/png", "image/gif", "image/webp"],
  folder = "contact-forms",
  disabled = false,
  title = "Attach Images (Optional)",
  description = "PNG, JPG, GIF up to 5MB each",
}: MultipleImageUploadProps) {
  const [uploadedImages, setUploadedImages] =
    useState<ImageMetadata[]>(initialImages);
  const [uploadingIds, setUploadingIds] = useState<Set<string>>(new Set());
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check if max images reached
  const isMaxReached = uploadedImages.length >= maxImages;

  // Handle multiple file uploads
  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    await processFiles(files);
  };

  // Process multiple files
  const processFiles = async (files: File[]) => {
    if (disabled) return;

    const remainingSlots = maxImages - uploadedImages.length;
    const filesToUpload = files.slice(0, remainingSlots);

    if (files.length > remainingSlots) {
      toast.warning(`Only ${remainingSlots} more image(s) can be uploaded`);
    }

    for (const file of filesToUpload) {
      await uploadSingleImage(file);
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Upload single image to Cloudinary
  const uploadSingleImage = async (file: File) => {
    // Create temporary image entry
    const tempId = `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const tempImage: ImageMetadata = {
      id: tempId,
      url: URL.createObjectURL(file),
      publicId: tempId,
      altText: file.name,
      width: 0,
      height: 0,
      format: file.type.split("/")[1] || "unknown",
    };

    // Add temp image and mark as uploading
    setUploadedImages((prev) => [...prev, tempImage]);
    setUploadingIds((prev) => new Set(prev).add(tempId));

    try {
      // Validate file
      const validation = validateFile(file, {
        maxSize: maxSizeMB * 1024 * 1024,
        acceptedFormats,
      });

      if (!validation.isValid) {
        throw new Error(validation.error || "Invalid file");
      }

      // Upload to Cloudinary
      const result = await uploadToCloudinaryDirect(file, { folder });

      if (result.success && result.url && result.publicId) {
        // Update with real data
        setUploadedImages((prev) => {
          const newImages = prev.map(
            (img): ImageMetadata =>
              img.id === tempId
                ? {
                    id: result.publicId!,
                    url: result.url!,
                    publicId: result.publicId!,
                    altText: file.name,
                    width: result.width,
                    height: result.height,
                    format: result.format,
                    size: result.size,
                    folder: folder,
                  }
                : img
          );

          // Notify parent
          onImagesChange?.(newImages);
          return newImages;
        });

        toast.success(`${file.name} uploaded successfully`);
      } else {
        throw new Error(result.error || "Upload failed");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to upload image";
      toast.error(errorMessage);

      // Remove failed upload
      setUploadedImages((prev) => prev.filter((img) => img.id !== tempId));
    } finally {
      // Remove from uploading IDs
      setUploadingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(tempId);
        return newSet;
      });
    }
  };

  // Remove image
  const removeImage = async (imageId: string) => {
    if (disabled) return;

    const imageToRemove = uploadedImages.find((img) => img.id === imageId);

    if (!imageToRemove) return;

    // Check if still uploading
    if (uploadingIds.has(imageId)) {
      toast.error("Please wait for upload to complete");
      return;
    }

    setUploadingIds((prev) => new Set(prev).add(imageId));

    try {
      // Delete from Cloudinary if it has a publicId
      if (
        imageToRemove.publicId &&
        !imageToRemove.publicId.startsWith("temp-")
      ) {
        await deleteCloudinaryImage(imageToRemove.publicId);
      }

      // Remove from state
      setUploadedImages((prev) => {
        const newImages = prev.filter((img) => img.id !== imageId);
        onImagesChange?.(newImages);
        return newImages;
      });

      toast.success("Image removed successfully");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to remove image";
      toast.error(errorMessage);
    } finally {
      setUploadingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(imageId);
        return newSet;
      });
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!disabled && !isMaxReached) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (disabled || isMaxReached) return;

    const files = Array.from(e.dataTransfer.files).filter((file) =>
      acceptedFormats.includes(file.type)
    );

    if (files.length > 0) {
      processFiles(files);
    }
  };

  const handleClick = () => {
    if (!disabled && !isMaxReached) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="space-y-4">
      <Typography variant="SemiBold_H6" className="text-foreground">
        {title}
      </Typography>

      <div className="space-y-4">
        {/* Upload Area */}
        <div
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            border-2 border-dashed rounded-lg p-6 text-center transition-colors
            ${
              disabled || isMaxReached
                ? "opacity-50 cursor-not-allowed bg-muted/30"
                : isDragging
                  ? "border-primary bg-primary/5 cursor-pointer"
                  : "border-border cursor-pointer hover:border-primary/50 hover:bg-muted/50"
            }
          `}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={acceptedFormats.join(",")}
            onChange={handleImageUpload}
            className="hidden"
            disabled={disabled || isMaxReached}
          />

          <label
            className={`cursor-pointer ${
              isMaxReached ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <Typography variant="Regular_H6" className="text-muted-foreground">
              {isMaxReached
                ? `Maximum ${maxImages} images reached`
                : "Click to upload images or drag and drop"}
            </Typography>
            <Typography variant="Regular_H7" className="text-muted-foreground">
              {description} (Max {maxImages} images)
            </Typography>
            {uploadedImages.length > 0 && (
              <Typography variant="Regular_H7" className="text-primary mt-2">
                {uploadedImages.length} / {maxImages} images uploaded
              </Typography>
            )}
          </label>
        </div>

        {/* Image Grid */}
        {uploadedImages.length > 0 && (
          <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
            {uploadedImages.map((image) => {
              const isUploading = uploadingIds.has(image.id);

              return (
                <div key={image.id} className="relative group">
                  {/* Show skeleton during upload */}
                  {isUploading ? (
                    <div className="relative w-full h-24 rounded-lg overflow-hidden">
                      <Skeleton className="absolute inset-0 w-full h-full" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Typography
                          variant="Regular_H7"
                          className="text-muted-foreground"
                        >
                          Uploading...
                        </Typography>
                      </div>
                    </div>
                  ) : (
                    /* Image */
                    <div className="relative w-full h-24">
                      <Image
                        src={image.url}
                        alt={image.altText || `Upload`}
                        fill
                        className="object-cover rounded-lg"
                        sizes="(max-width: 768px) 33vw, 20vw"
                        onLoad={(e) => {
                          const img = e.target as HTMLImageElement;
                          if (!image.width || !image.height) {
                            setUploadedImages((prev) =>
                              prev.map(
                                (prevImage): ImageMetadata =>
                                  prevImage.id === image.id
                                    ? {
                                        ...prevImage,
                                        width: img.naturalWidth,
                                        height: img.naturalHeight,
                                      }
                                    : prevImage
                              )
                            );
                          }
                        }}
                      />

                      {/* Format badge */}
                      {image.format && (
                        <div className="absolute bottom-1 left-1 bg-black/50 text-white text-xs px-1 rounded">
                          {image.format.toUpperCase()}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Remove button - only show if not uploading */}
                  {!isUploading && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6"
                      onClick={() => removeImage(image.id)}
                      disabled={disabled}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
