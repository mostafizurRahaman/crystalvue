"use client";

import * as React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, PlusCircle } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Typography } from "@/components/typography";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { SingleImageUpload } from "@/components/uploader/single-image-uploader";
import {
  createGallerySchema,
  CreateGalleryType,
} from "@/schemas/gallery/create-gallery";
import { createGallery } from "@/api/gallery";
import {
  CreateGalleryRequest,
  ImageMetadata,
  GalleryCategory,
} from "@/types/gallery";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function AddGalleryPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const queryClient = useQueryClient();

  const galleryCategoryOptions: { value: GalleryCategory; label: string }[] = [
    { value: "SHOWER_ENCLOSURES", label: "Shower Enclosures" },
    { value: "GLASS_DOORS", label: "Glass doors" },
    { value: "RAILINGS", label: "Railings" },
    { value: "WINDOWS", label: "Windows" },
    { value: "UPVC", label: "UPVC" },
  ];

  const form = useForm({
    resolver: zodResolver(createGallerySchema),
    defaultValues: {
      caption: "",
      isActive: true,
      image: undefined,
      galleryCategory: undefined,
    },
  });

  const onSubmit = async (data: CreateGalleryType) => {
    setIsSubmitting(true);
    try {
      // Transform data to match API requirements
      const submitData: CreateGalleryRequest = {
        caption: data.caption as string | undefined,
        image: data.image as ImageMetadata,
        isActive: data.isActive as boolean | undefined,
        galleryCategory: data.galleryCategory as GalleryCategory | undefined,
      };

      await createGallery(submitData);
      toast.success("Gallery created successfully");

      // Reset form and close modal
      form.reset();
      setIsOpen(false);

      // Refresh data
      router.refresh();
      await queryClient.invalidateQueries({ queryKey: ["galleries"] });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create gallery";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    form.reset();
    setIsOpen(false);
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)} size="sm">
        <PlusCircle className="mr-2 h-4 w-4" />
        <Typography variant="Medium_H7">Add Gallery</Typography>
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="!max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              <Typography variant="Bold_H4" as="span">
                Create New Gallery
              </Typography>
            </DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">
                        Gallery Image{" "}
                        <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <SingleImageUpload
                          value={field.value?.url}
                          publicId={field.value?.publicId}
                          onImageUpload={(url, metadata) => {
                            if (url && metadata) {
                              field.onChange({
                                url,
                                publicId: metadata.publicId,
                                folder: metadata.folder,
                                altText: metadata.altText,
                                width: metadata.width,
                                height: metadata.height,
                                format: metadata.format,
                                size: metadata.size,
                              });
                            } else {
                              field.onChange(undefined);
                            }
                          }}
                          folder="app/gallery"
                          disabled={isSubmitting}
                          uploadMethod="cloudinary"
                        />
                      </FormControl>

                      <FormMessage className="text-destructive" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="caption"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">Caption</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter gallery caption (max 255 characters)"
                          className="bg-background border-input text-foreground placeholder:text-muted-foreground min-h-[80px] resize-none"
                          disabled={isSubmitting}
                          {...field}
                          maxLength={255}
                        />
                      </FormControl>

                      <FormMessage className="text-destructive" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="galleryCategory"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">
                        Category
                      </FormLabel>
                      <FormControl>
                        <Select
                          value={field.value || ""}
                          onValueChange={(value) => {
                            field.onChange(
                              value === ""
                                ? undefined
                                : (value as GalleryCategory)
                            );
                          }}
                          disabled={isSubmitting}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a category..." />
                          </SelectTrigger>
                          <SelectContent>
                            {galleryCategoryOptions.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>

                      <FormMessage className="text-destructive" />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                  className="border-input text-foreground hover:bg-accent"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {isSubmitting ? "Creating..." : "Create"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
