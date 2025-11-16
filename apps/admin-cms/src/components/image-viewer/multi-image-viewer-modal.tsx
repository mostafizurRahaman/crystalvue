import React, { useState } from "react";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Download, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { Typography } from "@/components/typography";

interface MultiImageViewerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  images: string[];
  currentImageIndex?: number;
  imageAlt?: string;
  showDownload?: boolean;
}

export const MultiImageViewerModal = ({
  open,
  onOpenChange,
  images,
  currentImageIndex = 0,
  imageAlt = "Image",
  showDownload = true,
}: MultiImageViewerModalProps) => {
  const [currentIndex, setCurrentIndex] = useState(currentImageIndex);

  React.useEffect(() => {
    setCurrentIndex(currentImageIndex);
  }, [currentImageIndex]);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = images[currentIndex];
    link.download = `${imageAlt}_${currentIndex + 1}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (images.length === 0) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full !max-w-6xl p-0 gap-0 max-h-[95vh] overflow-hidden">
        {/* Header with Controls */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
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

        {/* Image Counter */}
        <div className="absolute top-4 left-4 z-20">
          <div className="bg-black/70 text-white px-3 py-1 rounded-full">
            <Typography variant="Regular_H7" className="text-white">
              {currentIndex + 1} / {images.length}
            </Typography>
          </div>
        </div>

        {/* Navigation Buttons */}
        {images.length > 1 && (
          <>
            {/* Previous Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 h-12 w-12 rounded-full bg-black/50 hover:bg-black/70 text-white shadow-lg"
              title="Previous image"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>

            {/* Next Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNext}
              className="absolute right-20 top-1/2 -translate-y-1/2 z-20 h-12 w-12 rounded-full bg-black/50 hover:bg-black/70 text-white shadow-lg"
              title="Next image"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </>
        )}

        {/* Main Image Content */}
        <div className="overflow-y-auto p-10 bg-gray-100">
          <div className="relative w-full !max-h-[65vh] flex items-center justify-center">
            <Image
              src={images[currentIndex]}
              alt={`${imageAlt} ${currentIndex + 1}`}
              width={800}
              height={600}
              className="w-full !max-h-[65vh] h-auto object-contain rounded-md"
              priority
            />
          </div>
        </div>

        {/* Thumbnail Strip */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 bg-black/70 p-2 rounded-full">
            <div className="flex space-x-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentIndex
                      ? "bg-white w-8"
                      : "bg-white/50 hover:bg-white/75"
                  }`}
                  title={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Keyboard Navigation */}
        {open && (
          <div className="sr-only">
            <p>Use left and right arrow keys to navigate images</p>
            <p>Press ESC to close</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
