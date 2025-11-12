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
  updateAboutBlocksSchema,
  UpdateAboutBlocksType,
} from "@/schemas/about/update-about-blocks";
import {
  getAboutBlocks,
  updateAboutBlocks,
  type UpdateAboutBlocksRequest,
} from "@/api/about";
import { Separator } from "@/components/ui/separator";
import { AboutBlocksFormSkeleton } from "./about-blocks-form-skeleton";

export function AboutBlocksForm() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<UpdateAboutBlocksType>({
    resolver: zodResolver(updateAboutBlocksSchema),
    defaultValues: {
      vision: {
        title: "",
        content: "",
        isActive: true,
      },
      mission: {
        title: "",
        content: "",
        isActive: true,
      },
    },
  });

  // Load current about blocks data
  useEffect(() => {
    setIsLoading(true);
    getAboutBlocks()
      .then((response) => {
        if (response.success && response.data) {
          const { visionBlock, missionBlock } = response.data;
          form.reset({
            vision: {
              title: visionBlock?.title || "",
              content: visionBlock?.content || "",
              isActive: visionBlock?.isActive ?? true,
              image: visionBlock?.image
                ? {
                    id: visionBlock.image.id,
                    url: visionBlock.image.url,
                    publicId: visionBlock.image.publicId,
                    altText: visionBlock.image.altText || undefined,
                    width: visionBlock.image.width || undefined,
                    height: visionBlock.image.height || undefined,
                    format: visionBlock.image.format || undefined,
                  }
                : undefined,
            },
            mission: {
              title: missionBlock?.title || "",
              content: missionBlock?.content || "",
              isActive: missionBlock?.isActive ?? true,
              image: missionBlock?.image
                ? {
                    id: missionBlock.image.id,
                    url: missionBlock.image.url,
                    publicId: missionBlock.image.publicId,
                    altText: missionBlock.image.altText || undefined,
                    width: missionBlock.image.width || undefined,
                    height: missionBlock.image.height || undefined,
                    format: missionBlock.image.format || undefined,
                  }
                : undefined,
            },
          });
        }
      })
      .catch((error) => {
        toast.error("Failed to load about blocks data");
        console.error("Error loading about blocks:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [form]);

  const onSubmit = async (data: UpdateAboutBlocksType) => {
    setIsSubmitting(true);
    try {
      const submitData: UpdateAboutBlocksRequest = {
        vision: {
          title: data.vision.title,
          content: data.vision.content,
          isActive: data.vision.isActive,
          image: data.vision.image
            ? {
                id: data.vision.image.id,
                url: data.vision.image.url,
                publicId: data.vision.image.publicId,
                folder: data.vision.image.folder || "app/about",
                altText: data.vision.image.altText,
                width: data.vision.image.width,
                height: data.vision.image.height,
                format: data.vision.image.format,
                size: data.vision.image.size,
              }
            : undefined,
        },
        mission: {
          title: data.mission.title,
          content: data.mission.content,
          isActive: data.mission.isActive,
          image: data.mission.image
            ? {
                id: data.mission.image.id,
                url: data.mission.image.url,
                publicId: data.mission.image.publicId,
                folder: data.mission.image.folder || "app/about",
                altText: data.mission.image.altText,
                width: data.mission.image.width,
                height: data.mission.image.height,
                format: data.mission.image.format,
                size: data.mission.image.size,
              }
            : undefined,
        },
      };

      const response = await updateAboutBlocks(submitData);

      if (response.success) {
        toast.success("About blocks updated successfully");
        await queryClient.invalidateQueries({ queryKey: ["about-blocks"] });
      } else {
        toast.error(response.message || "Failed to update about blocks");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to update about blocks";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <AboutBlocksFormSkeleton />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Typography variant="Bold_H4">Vision & Mission Blocks</Typography>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Vision Block */}
            <div className="space-y-6">
              <div className="space-y-2">
                <Typography variant="Bold_H5">Vision Block</Typography>
                <Separator />
              </div>

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="vision.title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vision Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter vision title"
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
                  name="vision.content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vision Content</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter vision content"
                          className="min-h-[120px] resize-none"
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
                  name="vision.image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vision Image</FormLabel>
                      <FormControl>
                        <SingleImageUpload
                          value={field.value?.url}
                          publicId={field.value?.publicId}
                          onImageUpload={(url, metadata) => {
                            if (url && metadata) {
                              field.onChange({
                                id: field.value?.id,
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
                  name="vision.isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border border-border p-4 bg-card">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Vision Active Status
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

            {/* Mission Block */}
            <div className="space-y-6">
              <div className="space-y-2">
                <Typography variant="Bold_H5">Mission Block</Typography>
                <Separator />
              </div>

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="mission.title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mission Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter mission title"
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
                  name="mission.content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mission Content</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter mission content"
                          className="min-h-[120px] resize-none"
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
                  name="mission.image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mission Image</FormLabel>
                      <FormControl>
                        <SingleImageUpload
                          value={field.value?.url}
                          publicId={field.value?.publicId}
                          onImageUpload={(url, metadata) => {
                            if (url && metadata) {
                              field.onChange({
                                id: field.value?.id,
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
                  name="mission.isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border border-border p-4 bg-card">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Mission Active Status
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

            <div className="flex justify-end gap-2">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isSubmitting ? "Updating..." : "Update Vision & Mission"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
