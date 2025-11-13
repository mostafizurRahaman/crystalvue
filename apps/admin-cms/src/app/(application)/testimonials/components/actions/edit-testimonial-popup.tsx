"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Typography } from "@/components/typography";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { ProfileImageUpload } from "@/components/uploader";

import { updateTestimonialSchema } from "@/schemas/testimonials";
import { updateTestimonial } from "@/api/testimonials";
import { Testimonial, UpdateTestimonialRequest } from "@/types";
import { extractPublicId } from "@/lib/cloudinary-utils";

interface EditTestimonialModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  testimonial: Testimonial;
  onSuccess?: () => void;
}

export function EditTestimonialModal({
  open,
  onOpenChange,
  testimonial,
  onSuccess,
}: EditTestimonialModalProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(updateTestimonialSchema),
    defaultValues: {
      name: "",
      message: "",
      rating: 5,
      position: "",
      company: "",
      image: undefined,
      isActive: true,
    },
    mode: "onSubmit",
  });

  // Load testimonial data for edit mode
  useEffect(() => {
    if (testimonial && open) {
      // Populate form with existing testimonial data
      const formData = {
        name: testimonial.name || "",
        message: testimonial.message || "",
        rating: testimonial.rating || 5,
        position: testimonial.position || "",
        company: testimonial.company || "",
        image: testimonial.image,
        isActive: testimonial.isActive ?? true,
      };

      form.reset(formData);
    }
  }, [testimonial, open, form]);

  const onSubmit: SubmitHandler<UpdateTestimonialRequest> = async (
    data: UpdateTestimonialRequest
  ) => {
    setIsSubmitting(true);
    try {
      console.log("Submitting form data:", data);

      // Ensure required fields are not empty
      const submitData = {
        ...data,
        message: data.message?.trim() || "",
        name: data.name?.trim() || "",
      };

      console.log("Testimonial data to send:", submitData);

      await updateTestimonial(testimonial.id, submitData);
      toast.success("Testimonial updated successfully");

      form.reset();
      onOpenChange(false);
      onSuccess?.();

      // Refresh data
      router.refresh();
      await queryClient.invalidateQueries({ queryKey: ["testimonials"] });
    } catch (error) {
      console.error("Form submission error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update testimonial";
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
      <DialogContent className="!max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            <Typography variant="Bold_H4" as="span">
              Edit Testimonial
            </Typography>
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="gap-6">
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-foreground">
                  Basic Information
                </h3>

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">
                        Name <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter testimonial name"
                          className="bg-background border-input text-foreground placeholder:text-muted-foreground"
                          disabled={isSubmitting}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-destructive" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">
                        Message <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter testimonial message"
                          className="bg-background border-input text-foreground placeholder:text-muted-foreground min-h-[100px] resize-none"
                          disabled={isSubmitting}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-destructive" />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="position"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground">
                          Position
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter position/title"
                            className="bg-background border-input text-foreground placeholder:text-muted-foreground"
                            disabled={isSubmitting}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-destructive" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="company"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground">
                          Company
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter company name"
                            className="bg-background border-input text-foreground placeholder:text-muted-foreground"
                            disabled={isSubmitting}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-destructive" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="my-5">
                <Separator className="bg-border" />
              </div>

              {/* Rating and Image */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-foreground">
                  Rating & Photo
                </h3>

                <FormField
                  control={form.control}
                  name="rating"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">
                        Rating <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <div className="flex items-center space-x-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              className="focus:outline-none transition-colors"
                              onClick={() => field.onChange(star)}
                              disabled={isSubmitting}
                            >
                              <Star
                                className={`w-6 h-6 ${
                                  star <= (field.value || 0)
                                    ? "text-yellow-400 fill-current"
                                    : "text-gray-300"
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </FormControl>
                      <FormMessage className="text-destructive" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">
                        Profile Image
                      </FormLabel>
                      <FormControl>
                        <ProfileImageUpload
                          value={field.value?.url}
                          publicId={
                            field.value?.publicId ||
                            (field.value?.url
                              ? extractPublicId(field.value.url)
                              : undefined)
                          }
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
                            } else if (url === null) {
                              // Image was removed
                              field.onChange(undefined);
                            }
                          }}
                          folder="testimonials"
                          disabled={isSubmitting}
                          className="mx-auto"
                        />
                      </FormControl>
                      <FormMessage className="text-destructive" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="my-5">
                <Separator className="bg-border" />
              </div>

              {/* Settings */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-foreground">
                  Settings
                </h3>

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
                {isSubmitting ? "Updating..." : "Update Testimonial"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
