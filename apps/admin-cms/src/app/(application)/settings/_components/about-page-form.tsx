"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Typography } from "@/components/typography";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SingleImageUpload } from "@/components/uploader/single-image-uploader";
import {
  updateAboutPageSchema,
  UpdateAboutPageType,
} from "@/schemas/about/update-about-page";
import {
  getAboutPage,
  updateAboutPage,
  type UpdateAboutPageRequest,
} from "@/api/about";
import { AboutPageFormSkeleton } from "./about-page-form-skeleton";

export function AboutPageForm() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<UpdateAboutPageType>({
    resolver: zodResolver(updateAboutPageSchema),
    defaultValues: {
      introTitle: "",
      introSubtitle: "",
      heroText: "",
      isActive: true,
    },
  });

  // Load current about page data
  useEffect(() => {
    setIsLoading(true);
    getAboutPage()
      .then((response) => {
        if (response.success && response.data) {
          const data = response.data;
          form.reset({
            introTitle: data.introTitle || "",
            introSubtitle: data.introSubtitle || "",
            heroText: data.heroText || "",
            isActive: data.isActive,
            bannerImage: data.bannerImage
              ? {
                  url: data.bannerImage.url,
                  publicId: data.bannerImage.publicId,
                  altText: data.bannerImage.altText || undefined,
                  width: data.bannerImage.width || undefined,
                  height: data.bannerImage.height || undefined,
                  format: data.bannerImage.format || undefined,
                }
              : undefined,
          });
        }
      })
      .catch((error) => {
        toast.error("Failed to load about page data");
        console.error("Error loading about page:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [form]);

  const onSubmit = async (data: UpdateAboutPageType) => {
    setIsSubmitting(true);
    try {
      const submitData: UpdateAboutPageRequest = {
        introTitle: data.introTitle,
        introSubtitle: data.introSubtitle,
        heroText: data.heroText,
        isActive: data.isActive,
        bannerImage: data.bannerImage
          ? {
              url: data.bannerImage.url,
              publicId: data.bannerImage.publicId,
              folder: data.bannerImage.folder || "app/about",
              altText: data.bannerImage.altText,
              width: data.bannerImage.width,
              height: data.bannerImage.height,
              format: data.bannerImage.format,
              size: data.bannerImage.size,
            }
          : undefined,
      };

      const response = await updateAboutPage(submitData);

      if (response.success) {
        toast.success("About page updated successfully");
        await queryClient.invalidateQueries({ queryKey: ["about-page"] });
      } else {
        toast.error(response.message || "Failed to update about page");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update about page";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <AboutPageFormSkeleton />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Typography variant="Bold_H4">About Page Configuration</Typography>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="introTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Intro Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter intro title"
                        disabled={isSubmitting}
                        maxLength={255}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="introSubtitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Intro Subtitle</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter intro subtitle"
                        disabled={isSubmitting}
                        maxLength={500}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="heroText"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hero Text</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter hero text"
                        className="min-h-[100px] resize-none"
                        disabled={isSubmitting}
                        maxLength={1000}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bannerImage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Banner Image</FormLabel>
                    <FormControl>
                      <SingleImageUpload
                        value={field.value?.url}
                        publicId={field.value?.publicId}
                        onImageUpload={(url, metadata) => {
                          if (url && metadata) {
                            field.onChange({
                              url,
                              publicId: metadata.publicId || "",
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
                        folder="app/about"
                        disabled={isSubmitting}
                        uploadMethod="cloudinary"
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
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border border-border p-4 bg-card">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Active Status</FormLabel>
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

            <div className="flex justify-end gap-2">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isSubmitting ? "Updating..." : "Update About Page"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
