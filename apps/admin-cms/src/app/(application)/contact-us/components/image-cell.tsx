"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/typography";
import { MultiImageViewerModal } from "@/components/image-viewer";
import { Eye } from "lucide-react";

interface ImageCellProps {
  images?: string[];
  title?: string;
}

export function ImageCell({ images, title }: ImageCellProps) {
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  const handleViewImages = () => {
    if (images && images.length > 0) {
      setIsViewerOpen(true);
    }
  };

  if (!images || images.length === 0) {
    return (
      <Typography variant="Regular_H7" className="text-gray-400">
        No Images
      </Typography>
    );
  }

  return (
    <>
      <div className="flex items-center justify-center">
        <Button
          variant="outline"
          size="sm"
          onClick={handleViewImages}
          className="flex items-center gap-1"
        >
          <Eye className="size-4" />
          View ({images.length})
        </Button>
      </div>

      <MultiImageViewerModal
        open={isViewerOpen}
        onOpenChange={setIsViewerOpen}
        images={images}
        imageAlt={title || "Contact inquiry images"}
        showDownload={true}
      />
    </>
  );
}
