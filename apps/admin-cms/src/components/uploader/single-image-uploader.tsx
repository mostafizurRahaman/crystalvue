import { useState, useRef, ChangeEvent, DragEvent, useEffect } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { toast } from "sonner";
import Image from "next/image";
import { uploadToCloudinaryDirect, validateFile } from "@/lib/cloudinary-utils";
import { deleteCloudinaryImage } from "@/api/upload/delete-image";
import type { ImageMetadata } from "@/types/shared";

interface SingleImageUploadProps {
  onImageSelect?: (file: File | null) => void;
  onImageUpload?: (url: string | null, metadata?: ImageMetadata) => void;
  value?: string; // URL of existing image
  publicId?: string; // Public ID of existing image for deletion
  maxSizeMB?: number;
  acceptedFormats?: string[];
  folder?: string;
  disabled?: boolean;
  uploadMethod?: "cloudinary" | "file";
}

export function SingleImageUpload({
  onImageSelect,
  onImageUpload,
  value,
  publicId,
  maxSizeMB = 5,
  acceptedFormats = ["image/jpeg", "image/png", "image/gif", "image/webp"],
  folder = "uploads",
  disabled = false,
  uploadMethod = "cloudinary",
}: SingleImageUploadProps) {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(value || null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false); // Combined state for uploading/deleting
  const [error, setError] = useState<string | null>(null);
  const [currentPublicId, setCurrentPublicId] = useState<string | null>(
    publicId || null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync state when props change (for editing existing images)
  useEffect(() => {
    setPreview(value || null);
    setCurrentPublicId(publicId || null);
  }, [value, publicId]);

  const handleFile = async (file: File) => {
    if (uploadMethod === "cloudinary") {
      await handleCloudinaryUpload(file);
    } else {
      // Local file handling logic...
    }
  };

  const handleCloudinaryUpload = async (file: File) => {
    setIsProcessing(true);
    setError(null);

    try {
      const validation = validateFile(file, {
        maxSize: maxSizeMB * 1024 * 1024,
        acceptedFormats,
      });

      if (!validation.isValid) {
        throw new Error(validation.error || "Invalid file");
      }

      const result = await uploadToCloudinaryDirect(file, { folder });

      if (result.success && result.url && result.publicId) {
        setPreview(result.url);
        setCurrentPublicId(result.publicId);
        setImage(file);

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
        onImageSelect?.(file);
        toast.success("Image uploaded successfully");
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

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
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
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleRemove = async () => {
    if (disabled || isProcessing) return;

    setIsProcessing(true);

    try {
      // If we have a publicId, delete from Cloudinary first
      if (currentPublicId) {
        toast.loading("Removing image...");
        await deleteCloudinaryImage(currentPublicId);
        toast.dismiss();
        toast.success("Image removed successfully");
      }

      // Only clear state after successful deletion
      setImage(null);
      setPreview(null);
      setError(null);
      setCurrentPublicId(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // Use null instead of undefined for React Hook Form
      onImageSelect?.(null);
      onImageUpload?.(null);
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

  const handleClick = () => {
    if (!disabled && !isProcessing) {
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
        disabled={disabled || isProcessing}
        className="hidden"
      />

      {!preview ? (
        <div
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
            transition-colors duration-200
            ${
              disabled || isProcessing
                ? "cursor-not-allowed opacity-50"
                : isDragging
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50 bg-muted/50"
            }
          `}
        >
          <div className="flex flex-col items-center gap-3">
            {isProcessing ? (
              <div className="p-3 bg-background rounded-full border border-border">
                <Loader2 className="w-8 h-8 text-muted-foreground animate-spin" />
              </div>
            ) : (
              <div className="p-3 bg-background rounded-full border border-border">
                <Upload className="w-8 h-8 text-muted-foreground" />
              </div>
            )}
            <div>
              {isProcessing ? (
                <p className="text-foreground">Processing...</p>
              ) : (
                <p className="text-foreground">
                  <span className="text-primary">Click to upload</span> or drag
                  and drop
                </p>
              )}
              <p className="text-sm text-muted-foreground mt-1">
                {acceptedFormats
                  .map((f) => f.split("/")[1].toUpperCase())
                  .join(", ")}{" "}
                (max {maxSizeMB}MB)
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative rounded-lg overflow-hidden border border-border">
          <div className="relative w-full h-64">
            <Image
              src={preview}
              alt="Preview"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          <div className="absolute top-2 right-2">
            <Button
              onClick={handleRemove}
              variant="destructive"
              size="icon"
              className="h-8 w-8"
              disabled={disabled || isProcessing}
            >
              {isProcessing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <X className="h-4 w-4" />
              )}
            </Button>
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/80 to-transparent p-3 backdrop-blur-sm">
            <p className="text-foreground text-sm truncate">{image?.name}</p>
          </div>
        </div>
      )}

      {error && <p className="text-destructive text-sm mt-2">{error}</p>}
    </div>
  );
}
