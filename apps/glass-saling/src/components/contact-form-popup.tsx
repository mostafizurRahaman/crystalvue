"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Typography } from "@/components/typography";
import { X, Loader2, Upload } from "lucide-react";
import { toast } from "sonner";
import { ContactFormData, ContactFormSchema } from "@/api/types/contact.types";
import { createContactUsForm } from "@/api";
import type { GalleryImage, Service } from "@/api";
import Image from "next/image";
import { MultipleImageUpload } from "./ui/image-uploader";

interface ContactFormPopupProps {
  isOpen: boolean;
  onClose: () => void;
  selectedService?: Service;
}

export function ContactFormPopup({
  isOpen,
  onClose,
  selectedService,
}: ContactFormPopupProps) {
  const [uploadedImages, setUploadedImages] = useState<GalleryImage[]>([]);

  // Initialize React Hook Form
  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(ContactFormSchema),
    defaultValues: {
      fullName: "",
      phoneNumber: "",
      email: "",
      address: "",
      parentCategoryId: selectedService?.parentCategoryId || "",
      serviceId: selectedService?.id || "",
      message: "",
      status: "PENDING",
      images: [],
    },
  });

  // Update form values when props change
  useEffect(() => {
    if (selectedService) {
      setValue("parentCategoryId", selectedService?.parentCategoryId || "");
      setValue("serviceId", selectedService?.id || "");
    }
  }, [selectedService, setValue]);

  

  // Form submission
  const onSubmit = async (data: ContactFormData) => {
    try {
      // In production, upload images to server first and get actual URLs
      const response = await createContactUsForm(data);

      if (response.success) {
        toast.success("Contact form submitted successfully!");
        handleClose();
      } else {
        toast.error(response.message || "Failed to submit form");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to submit form");
      }
    }
  };

  // Close and reset form
  const handleClose = () => {
    reset({
      fullName: "",
      phoneNumber: "",
      email: "",
      address: "",
      parentCategoryId: selectedService?.parentCategoryId || "",
      serviceId: selectedService?.id || "",
      message: "",
      status: "PENDING",
      images: [],
    });
    setUploadedImages([]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-2xl font-bold">
            Request Service
          </DialogTitle>
         
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Controller
                  name="fullName"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="fullName"
                      placeholder="Enter your full name"
                      className={errors.fullName ? "border-red-500" : ""}
                    />
                  )}
                />
                {errors.fullName && (
                  <p className="text-sm text-red-500">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number *</Label>
                <Controller
                  name="phoneNumber"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="phoneNumber"
                      placeholder="Enter your phone number"
                      className={errors.phoneNumber ? "border-red-500" : ""}
                    />
                  )}
                />
                {errors.phoneNumber && (
                  <p className="text-sm text-red-500">
                    {errors.phoneNumber.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      className={errors.email ? "border-red-500" : ""}
                    />
                  )}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              {/* Address */}
              <div className="space-y-2">
                <Label htmlFor="address">Address *</Label>
                <Controller
                  name="address"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="address"
                      placeholder="Enter your address"
                      className={errors.address ? "border-red-500" : ""}
                    />
                  )}
                />
                {errors.address && (
                  <p className="text-sm text-red-500">
                    {errors.address.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Service Information - Read Only */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Category - Read Only */}
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Input
                  id="category"
                  value={
                    selectedService?.parentCategory?.name ||
                    "No category selected"
                  }
                  disabled
                  className="bg-muted cursor-not-allowed"
                />
                {/* Hidden field for form submission */}
                <Controller
                  name="parentCategoryId"
                  control={control}
                  render={({ field }) => <input type="hidden" {...field} />}
                />
                {errors.parentCategoryId && (
                  <p className="text-sm text-red-500">
                    {errors.parentCategoryId.message}
                  </p>
                )}
              </div>

              {/* Service - Read Only */}
              <div className="space-y-2">
                <Label htmlFor="service">Service *</Label>
                <Input
                  id="service"
                  value={selectedService?.name || "No service selected"}
                  disabled
                  className="bg-muted cursor-not-allowed"
                />
                {/* Hidden field for form submission */}
                <Controller
                  name="serviceId"
                  control={control}
                  render={({ field }) => <input type="hidden" {...field} />}
                />
                {errors.serviceId && (
                  <p className="text-sm text-red-500">
                    {errors.serviceId.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="message">Your Message *</Label>
            <Controller
              name="message"
              control={control}
              render={({ field }) => (
                <Textarea
                  {...field}
                  id="message"
                  placeholder="Tell us about your requirements..."
                  rows={4}
                  className={errors.message ? "border-red-500" : ""}
                />
              )}
            />
            {errors.message && (
              <p className="text-sm text-red-500">{errors.message.message}</p>
            )}
          </div>

          <MultipleImageUpload
            onImagesChange={(images) => {
              // Convert ImageMetadata to GalleryImage for compatibility
              const galleryImages: GalleryImage[] = images.map(img => ({
                id: img.id,
                url: img.url,
                publicId: img.publicId,
                altText: img.altText,
                width: img.width,
                height: img.height,
                format: img.format,
              }));
              setUploadedImages(galleryImages);
              // Update React Hook Form
              setValue(
                "images",
                images.map((img) => img.url)
              );
            }}
            initialImages={uploadedImages.map(img => ({
              id: img.id,
              url: img.url,
              publicId: img.publicId,
              altText: img.altText,
              width: img.width,
              height: img.height,
              format: img.format,
              size: 0,
              folder: "contact-forms"
            }))}
            maxImages={5}
            maxSizeMB={5}
            folder="contact-forms"
            title="Attach Images (Optional)"
            description="PNG, JPG, GIF up to 5MB each"
          />
          {/* Submit Button */}
          <div className="flex gap-4 pt-4">
            <Button type="submit" className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Request"
              )}
            </Button>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
