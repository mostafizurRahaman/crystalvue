import React from "react";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Download } from "lucide-react";
import Image from "next/image";

interface ImageViewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageUrl: string;
  imageAlt?: string;
  onDownload?: () => void;
  showDownload?: boolean;
}

export const ImageViewModal = ({
  open,
  onOpenChange,
  imageUrl,
  imageAlt = "Image",
  onDownload,
  showDownload = true,
}: ImageViewModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full !max-w-6xl p-0 gap-0 max-h-[95vh] overflow-hidden">
        {/* Header with Close Button */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
          {showDownload && onDownload && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onDownload}
              className="h-10 w-10 rounded-full bg-white/90 hover:bg-white shadow-lg"
            >
              <Download className="h-5 w-5" />
            </Button>
          )}
          <DialogClose asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-lg"
            >
              <X className="h-5 w-5" />
            </Button>
          </DialogClose>
        </div>

        {/* Image Content */}
        <div className="overflow-y-auto p-10 bg-gray-100">
          <div className="relative w-full !max-h-[65vh] flex items-center justify-center">
            <Image
              src={imageUrl}
              alt={imageAlt}
              width={800}
              height={600}
              className="w-full !max-h-[65vh] h-auto object-contain rounded-md"
              priority
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
