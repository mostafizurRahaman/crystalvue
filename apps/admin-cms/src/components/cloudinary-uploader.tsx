// components/cloudinary-multi-image-upload.tsx
"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { X, File, Play, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
  extractPublicId,
} from "@/api/cloudinary";

interface MultiImageUploadProps {
  value?: string[];
  onChange?: (urls: string[]) => void;
  maxImages?: number;
  className?: string;
  name?: string;
  accept?: string;
  folder?: string;
  disabled?: boolean;
}

interface UploadedFile {
  id: string;
  url: string;
  publicId: string;
  progress: number;
  fileType: string;
  isUploading: boolean;
  isDeleting: boolean;
}

const MultiImageUpload: React.FC<MultiImageUploadProps> = ({
  value = [],
  onChange,
  maxImages,
  className,
  name,
  accept = "image/*,video/*",
  folder = "uploads",
  disabled = false,
}) => {
  const [files, setFiles] = useState<UploadedFile[]>(() =>
    value.map((url, index) => {
      const isVideo = url.includes(".mp4") || url.includes(".webm");
      const extension = url.split(".").pop()?.toLowerCase() || "";

      let fileType = "application/octet-stream";
      if (isVideo) {
        fileType = `video/${extension}`;
      } else {
        fileType = `image/${extension === "jpg" ? "jpeg" : extension}`;
      }

      return {
        id: `${index}-${Date.now()}`,
        url,
        publicId: extractPublicId(url),
        progress: 100,
        fileType,
        isUploading: false,
        isDeleting: false,
      };
    })
  );

  const prevValueRef = useRef<string[]>(value);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync with parent value
  useEffect(() => {
    const valueChanged =
      JSON.stringify(value) !== JSON.stringify(prevValueRef.current);

    if (valueChanged && onChange) {
      const currentUrls = files
        .filter((f) => !f.url.startsWith("blob:") && !f.isUploading)
        .map((f) => f.url);

      const valueSet = new Set(value);
      const currentSet = new Set(currentUrls);

      // Check if we need to update internal state
      if (
        value.length !== currentUrls.length ||
        value.some((url) => !currentSet.has(url))
      ) {
        setFiles(
          value.map((url, index) => {
            const existing = files.find((f) => f.url === url);
            if (existing) return existing;

            const isVideo = url.includes(".mp4") || url.includes(".webm");
            const extension = url.split(".").pop()?.toLowerCase() || "";

            let fileType = "application/octet-stream";
            if (isVideo) {
              fileType = `video/${extension}`;
            } else {
              fileType = `image/${extension === "jpg" ? "jpeg" : extension}`;
            }

            return {
              id: `${index}-${Date.now()}`,
              url,
              publicId: extractPublicId(url),
              progress: 100,
              fileType,
              isUploading: false,
              isDeleting: false,
            };
          })
        );
      }

      prevValueRef.current = value;
    }
  }, [value, files, onChange]);

  // Notify parent of changes
  useEffect(() => {
    const publicUrls = files
      .filter((f) => !f.url.startsWith("blob:") && !f.isUploading)
      .map((f) => f.url);

    if (
      onChange &&
      JSON.stringify(publicUrls) !== JSON.stringify(prevValueRef.current)
    ) {
      onChange(publicUrls);
      prevValueRef.current = publicUrls;
    }
  }, [files, onChange]);

  const handleUpload = useCallback(
    async (filesList: FileList) => {
      if (disabled) return;

      const fileArray = Array.from(filesList).slice(
        0,
        maxImages ? maxImages - files.length : undefined
      );

      if (fileArray.length === 0 && maxImages) {
        console.warn(`Maximum of ${maxImages} files allowed`);
        return;
      }

      const newFiles: UploadedFile[] = fileArray.map((file) => ({
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        url: URL.createObjectURL(file),
        publicId: "",
        progress: 0,
        fileType: file.type || "application/octet-stream",
        isUploading: true,
        isDeleting: false,
      }));

      setFiles((prev) => [...prev, ...newFiles]);

      // Upload files concurrently
      const uploadPromises = newFiles.map(async (newFile, index) => {
        const file = fileArray[index];

        try {
          const resourceType = file.type.startsWith("video/")
            ? "video"
            : "image";
          const result = await uploadToCloudinary(file, folder, resourceType);

          setFiles((prev) => {
            const updated = prev.map((f) => {
              if (f.id === newFile.id) {
                if (f.url.startsWith("blob:")) {
                  URL.revokeObjectURL(f.url);
                }
                return {
                  ...f,
                  url: result.secure_url,
                  publicId: result.public_id,
                  isUploading: false,
                  progress: 100,
                };
              }
              return f;
            });
            return updated;
          });
        } catch (error) {
          console.error(`Upload failed for ${file.name}:`, error);
          if (newFile.url.startsWith("blob:")) {
            URL.revokeObjectURL(newFile.url);
          }
          setFiles((prev) => prev.filter((f) => f.id !== newFile.id));
        }
      });

      await Promise.all(uploadPromises);
    },
    [files.length, maxImages, folder, disabled]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      if (disabled) return;

      const fileToDelete = files.find((f) => f.id === id);
      if (!fileToDelete) return;

      setFiles((prev) =>
        prev.map((f) => (f.id === id ? { ...f, isDeleting: true } : f))
      );

      try {
        if (fileToDelete.publicId) {
          await deleteFromCloudinary(fileToDelete.publicId);
        }
        setFiles((prev) => prev.filter((f) => f.id !== id));
      } catch (error) {
        console.error("Delete failed:", error);
        setFiles((prev) =>
          prev.map((f) => (f.id === id ? { ...f, isDeleting: false } : f))
        );
      }
    },
    [files, disabled]
  );

  // Cleanup blob URLs on unmount
  useEffect(() => {
    return () => {
      files.forEach((file) => {
        if (file.url.startsWith("blob:")) {
          URL.revokeObjectURL(file.url);
        }
      });
    };
  }, [files]);

  return (
    <div className={cn("flex flex-col w-full", className)}>
      <div className="flex flex-wrap gap-4">
        {(maxImages === undefined || files.length < maxImages) && (
          <Button
            variant="outline"
            className="h-20 w-20 sm:h-24 sm:w-24 flex-shrink-0"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled}
            type="button"
          >
            <div className="flex flex-col items-center gap-1">
              <Upload className="h-5 w-5" />
              <span className="text-xs">Browse</span>
            </div>
          </Button>
        )}

        {files.map((file) => {
          const isImage = file.fileType.startsWith("image/");
          const isVideo = file.fileType.startsWith("video/");

          return (
            <div
              key={file.id}
              className={cn(
                "relative flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-md transition-all duration-300",
                file.isDeleting && "opacity-50 scale-95"
              )}
            >
              {isImage ? (
                <img
                  src={file.url}
                  alt="Uploaded file"
                  className="w-full h-full object-cover rounded-md"
                  loading="lazy"
                />
              ) : isVideo ? (
                <div className="relative w-full h-full rounded-md overflow-hidden bg-gray-100">
                  <video
                    src={file.url}
                    className="w-full h-full object-cover"
                    muted
                    playsInline
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none">
                    <Play className="h-6 w-6 sm:h-8 sm:w-8 text-white/90 fill-white/90" />
                  </div>
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-md">
                  <File className="h-8 w-8 text-gray-500 sm:h-10 sm:w-10" />
                </div>
              )}

              {file.isUploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-md">
                  <span className="text-white text-xs sm:text-sm">
                    Uploading...
                  </span>
                </div>
              )}

              {!file.isUploading && !file.isDeleting && (
                <button
                  onClick={() => handleDelete(file.id)}
                  className="absolute right-1 top-1 rounded-full bg-gray-200 p-1 text-gray-600 hover:bg-gray-300 focus:outline-none"
                  aria-label="Remove file"
                  type="button"
                  disabled={disabled}
                >
                  <X className="h-3 w-3 sm:h-4 sm:w-4" />
                </button>
              )}
            </div>
          );
        })}

        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple
          className="hidden"
          name={name}
          onChange={(e) =>
            e.target.files?.length && handleUpload(e.target.files)
          }
          disabled={disabled}
        />
      </div>
    </div>
  );
};

export default MultiImageUpload;
