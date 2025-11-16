"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/typography";
import { ImageViewModal } from "@/components/image-viewer";
import { Eye } from "lucide-react";

interface ImageCellProps {
  imageUrl?: string;
  title?: string;
}

export function ImageCell({ imageUrl, title }: ImageCellProps) {
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  return (
    <>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsViewerOpen(true)}
          className="flex items-center gap-1"
        >
          <Eye className="size-4" />
          View
        </Button>
      </div>

      <ImageViewModal
        open={isViewerOpen}
        onOpenChange={setIsViewerOpen}
        imageUrl={imageUrl || ""}
        imageAlt={title || "Slider image"}
      />
    </>
  );
}
