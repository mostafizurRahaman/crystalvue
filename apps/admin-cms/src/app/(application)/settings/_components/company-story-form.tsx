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
  updateCompanyStorySchema,
  UpdateCompanyStoryType,
} from "@/schemas/about/update-company-story";
import {
  getCompanyStory,
  updateCompanyStory,
  type UpdateCompanyStoryRequest,
} from "@/api/about";
import { CompanyStoryFormSkeleton } from "./company-story-form-skeleton";

export function CompanyStoryForm() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<UpdateCompanyStoryType>({
    resolver: zodResolver(updateCompanyStorySchema),
    defaultValues: {
      title: "",
      content: "",
      leftImage: undefined,
      isActive: true,
    },
  });

  // Load current company story data
  useEffect(() => {
    setIsLoading(true);
    getCompanyStory()
      .then((response) => {
        if (response.success && response.data.companyStory) {
          const data = response.data.companyStory;
          form.reset({
            title: data.title || "",
            content: data.content || "",
            leftImage: data.leftImage
              ? {
                  id: data.leftImage.id,
                  url: data.leftImage.url,
                  publicId: data.leftImage.publicId ?? undefined,
                  folder: "app/about",
                  altText: data.leftImage.altText ?? undefined,
                  width: data.leftImage.width ?? undefined,
                  height: data.leftImage.height ?? undefined,
                  format: data.leftImage.format ?? undefined,
                  size: undefined,
                }
              : undefined,
            isActive: data.isActive ?? true,
          });
        }
      })
      .catch((error) => {
        toast.error("Failed to load company story data");
        console.error("Error loading company story:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [form]);

  const onSubmit = async (data: UpdateCompanyStoryType) => {
    setIsSubmitting(true);
    try {
      const submitData: UpdateCompanyStoryRequest = {
        title: data.title,
        content: data.content,
        leftImage: data.leftImage,
        isActive: data.isActive,
      };

      const response = await updateCompanyStory(submitData);

      if (response.success) {
        toast.success("Company story updated successfully");
        await queryClient.invalidateQueries({ queryKey: ["company-story"] });
      } else {
        toast.error(response.message || "Failed to update company story");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to update company story";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <CompanyStoryFormSkeleton />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Typography variant="Bold_H4">Company Story</Typography>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter story title"
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
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter story content"
                        className="min-h-[150px] resize-none"
                        disabled={isSubmitting}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="leftImage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Left Image</FormLabel>
                    <FormControl>
                      <SingleImageUpload
                        value={field.value?.url}
                        publicId={field.value?.publicId}
                        onImageUpload={(url, metadata) => {
                          if (url && metadata) {
                            field.onChange({
                              id: metadata.id,
                              url,
                              publicId: metadata.publicId ?? undefined,
                              folder: metadata.folder ?? undefined,
                              altText: metadata.altText ?? undefined,
                              width: metadata.width ?? undefined,
                              height: metadata.height ?? undefined,
                              format: metadata.format ?? undefined,
                              size: metadata.size ?? undefined,
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
                {isSubmitting ? "Updating..." : "Update Company Story"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
