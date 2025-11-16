import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { Typography } from "@/components/typography";
import { updateSlider } from "@/api/sliders";
import {
  editSliderFormSchema,
  EditSliderFormData,
  Slider,
} from "@/schemas/sliders";
import { SingleImageUpload } from "@/components/uploader/single-image-uploader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EditSliderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  slider: Slider;
  onSuccess?: () => void;
}

export const EditSliderDialog = ({
  open,
  onOpenChange,
  slider,
  onSuccess,
}: EditSliderDialogProps) => {
  const queryClient = useQueryClient();

  const form = useForm<EditSliderFormData>({
    resolver: zodResolver(editSliderFormSchema),
    defaultValues: {
      title: slider.title,
      subtitle: slider.subtitle || "",
      image: slider.image
        ? {
            url: slider.image.url,
            publicId: slider.image.publicId,
            folder: slider.image.folder || undefined,
            altText: slider.image.altText || undefined,
            width: slider.image.width || undefined,
            height: slider.image.height || undefined,
            format: slider.image.format || undefined,
            size: slider.image.size || undefined,
          }
        : {
            url: "",
            publicId: "",
            folder: "app/hero-sliders",
            altText: "",
            width: undefined,
            height: undefined,
            format: undefined,
            size: undefined,
          },
      orderNumber: slider.orderNumber,
      buttonUrl: slider.buttonUrl || "",
      buttonText: slider.buttonText || "",
      isActive: slider.isActive,
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        title: slider.title,
        subtitle: slider.subtitle || "",
        image: slider.image
          ? {
              url: slider.image.url,
              publicId: slider.image.publicId,
              folder: slider.image.folder || undefined,
              altText: slider.image.altText || undefined,
              width: slider.image.width || undefined,
              height: slider.image.height || undefined,
              format: slider.image.format || undefined,
              size: slider.image.size || undefined,
            }
          : {
              url: "",
              publicId: "",
              folder: "app/hero-sliders",
              altText: "",
              width: undefined,
              height: undefined,
              format: undefined,
              size: undefined,
            },
        orderNumber: slider.orderNumber,
        buttonUrl: slider.buttonUrl || "",
        buttonText: slider.buttonText || "",
        isActive: slider.isActive,
      });
    }
  }, [open, slider, form]);

  const onSubmit = async (data: EditSliderFormData) => {
    try {
      // Transform form data to API format
      const apiData = {
        title: data.title,
        subtitle: data.subtitle || "",
        buttonText: data.buttonText,
        buttonUrl: data.buttonUrl,
        image: data.image,
        isActive: data.isActive ?? true,
        orderNumber: data.orderNumber,
      };

      const response = await updateSlider(slider.id, apiData);

      if (response.success) {
        toast.success(response.message);
        queryClient.invalidateQueries({ queryKey: ["sliders"] });
        onOpenChange(false);
        onSuccess?.();
      } else {
        toast.error(response.message || "Failed to update slider");
      }
    } catch (error) {
      console.error("Update slider failed:", error);
      toast.error("Failed to update slider. Please try again.");
    }
  };

  // Handle form validation errors
  const onError = (errors: Record<string, unknown>) => {
    if (errors.image) {
      toast.error("Image is required for slider update");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full p-6 max-h-[90vh] overflow-y-auto !max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            <Typography variant="Bold_H4" as="span">
              Edit Slider
            </Typography>
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, onError)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <Typography variant="Medium_H6">Title *</Typography>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter slider title"
                      {...field}
                      disabled={form.formState.isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subtitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <Typography variant="Medium_H6">Subtitle</Typography>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter subtitle (optional)"
                      rows={2}
                      {...field}
                      disabled={form.formState.isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="buttonText"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <Typography variant="Medium_H6">Button Text</Typography>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Learn More"
                        {...field}
                        disabled={form.formState.isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="buttonUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <Typography variant="Medium_H6">Button URL</Typography>
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={form.formState.isSubmitting}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a path" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="/contact-us">/contact-us</SelectItem>
                        <SelectItem value="/services">/services</SelectItem>
                        <SelectItem value="/about-us">/about-us</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="orderNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <Typography variant="Medium_H6">Order Number</Typography>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter order number"
                        defaultValue={field.value || ""}
                        onChange={(e) => {
                          const value = e.target.value;

                          // Allow empty string
                          if (value === "") {
                            field.onChange(undefined);
                            return;
                          }

                          // Only allow digits (no letters, special chars, etc.)
                          if (/^\d+$/.test(value)) {
                            const numValue = Number(value);
                            if (numValue > 0) {
                              field.onChange(numValue);
                            }
                          }
                          // If input contains non-digits, don't update the field
                          // This prevents invalid characters from being entered
                        }}
                        disabled={form.formState.isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <Typography variant="Medium_H6">Status</Typography>
                    </FormLabel>
                    <Select
                      onValueChange={(value) =>
                        field.onChange(value === "true")
                      }
                      value={String(field.value)}
                      disabled={form.formState.isSubmitting}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="true">Active</SelectItem>
                        <SelectItem value="false">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <Typography variant="Medium_H6">Slider Image *</Typography>
                  </FormLabel>
                  <FormControl>
                    <SingleImageUpload
                      value={field.value?.url || ""}
                      publicId={field.value?.publicId}
                      onImageUpload={(url, metadata) => {
                        if (url) {
                          field.onChange({
                            url,
                            publicId: metadata?.publicId || undefined,
                            folder: metadata?.folder || "app/hero-sliders",
                            altText:
                              metadata?.altText || form.getValues("title"),
                            width: metadata?.width,
                            height: metadata?.height,
                            format: metadata?.format,
                            size: metadata?.size,
                          });
                        } else {
                          field.onChange(null);
                        }
                      }}
                      folder="app/hero-sliders"
                      disabled={form.formState.isSubmitting}
                      uploadMethod="cloudinary"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="flex flex-row justify-end gap-2 pt-4">
              <DialogClose asChild>
                <Button
                  variant="outline"
                  type="button"
                  disabled={form.formState.isSubmitting}
                >
                  <Typography variant="Medium_H6">Cancel</Typography>
                </Button>
              </DialogClose>
              <Button
                variant="default"
                type="submit"
                disabled={form.formState.isSubmitting}
              >
                <Typography variant="Medium_H6">
                  {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
                </Typography>
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
