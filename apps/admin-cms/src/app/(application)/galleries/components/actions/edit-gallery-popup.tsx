"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  updateGallerySchema,
  UpdateGalleryType,
} from "@/schemas/gallery/update-gallery";
import { updateGallery } from "@/api/gallery";
import {
  Gallery,
  UpdateGalleryRequest,
  GalleryCategory,
} from "@/types/gallery";
import { getGalleryDetails } from "@/api/gallery";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EditGalleryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  gallery: Gallery;
  onSuccess?: () => void;
}

export function EditGalleryPopup({
  open,
  onOpenChange,
  gallery,
  onSuccess,
}: EditGalleryModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const queryClient = useQueryClient();

  const galleryCategoryOptions: { value: GalleryCategory; label: string }[] = [
    { value: "SHOWER_ENCLOSURES", label: "Shower Enclosures" },
    { value: "GLASS_DOORS", label: "Glass doors" },
    { value: "RAILINGS", label: "Railings" },
    { value: "WINDOWS", label: "Windows" },
    { value: "UPVC", label: "UPVC" },
  ];

  const form = useForm<UpdateGalleryType>({
    resolver: zodResolver(updateGallerySchema),
    defaultValues: {
      caption: "",
      galleryCategory: undefined,
      isActive: true,
    },
  });

  // Load current gallery data
  useEffect(() => {
    if (open && gallery?.id) {
      setIsLoading(true);
      getGalleryDetails(gallery.id)
        .then((response) => {
          if (response.success) {
            const galleryData = response.data.gallery;
            form.reset({
              caption: galleryData.caption || "",
              galleryCategory: galleryData.galleryCategory || undefined,
              isActive: galleryData.isActive,
            });
          }
        })
        .catch((error) => {
          toast.error("Failed to load gallery details");
          console.error("Error loading gallery:", error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else if (!open) {
      form.reset();
    }
  }, [open, gallery?.id, form]);

  const onSubmit = async (data: UpdateGalleryType) => {
    if (!gallery?.id) return;

    setIsSubmitting(true);
    try {
      const submitData: UpdateGalleryRequest = {
        caption: data.caption,
        galleryCategory: data.galleryCategory,
        isActive: data.isActive,
      };

      const response = await updateGallery(gallery.id, submitData);

      if (response.success) {
        toast.success("Gallery updated successfully");
        onOpenChange(false);
        onSuccess?.();

        // Refresh data
        router.refresh();
        await queryClient.invalidateQueries({ queryKey: ["galleries"] });
      } else {
        toast.error(response.message || "Failed to update gallery");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update gallery";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            <Typography variant="Bold_H4" as="span">
              Edit Gallery Item
            </Typography>
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
            <Typography variant="Medium_H6" className="ml-2">
              Loading gallery details...
            </Typography>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
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
                              value === "" ? null : (value as GalleryCategory)
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

                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border border-border p-4 bg-card">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base text-foreground">
                          Active Status
                        </FormLabel>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={isSubmitting}
                        />
                      </FormControl>
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
                  {isSubmitting ? "Updating..." : "Update Gallery"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
