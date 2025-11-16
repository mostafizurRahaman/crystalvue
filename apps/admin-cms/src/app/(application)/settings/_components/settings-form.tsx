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
import { Separator } from "@/components/ui/separator";
import { SingleImageUpload } from "@/components/uploader/single-image-uploader";
import {
  updateSettingsSchema,
  UpdateSettingsType,
} from "@/schemas/settings/update-settings";
import {
  getSettings,
  updateSettings,
  type UpdateSettingsRequest,
} from "@/api/settings";
import { SettingsFormSkeleton } from "./settings-form-skeleton";

export function SettingsForm() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<UpdateSettingsType>({
    resolver: zodResolver(updateSettingsSchema),
    defaultValues: {
      siteTitle: "",
      siteDescription: "",
      logoImage: undefined,
      faviconImage: undefined,
      metaImage: undefined,
      contactEmail: "",
      contactPhone: "",
      contactWhatsApp: "",
      officeAddress: "",
      googleMapEmbedCode: "",
      socialMediaLinks: {
        facebook: "",
        twitter: "",
        linkedin: "",
        instagram: "",
      },
      seoMetaTitle: "",
      seoMetaDescription: "",
      seoKeywords: "",
      isActive: true,
      businessHours: {
      openingText: "",
      closeText: "",
    },
    },
  });

  // Load current settings data
  useEffect(() => {
    setIsLoading(true);
    getSettings()
      .then((response) => {
        if (response.success && response.data) {
          const data = response.data;
          form.reset({
            siteTitle: data.siteTitle || "",
            siteDescription: data.siteDescription || "",
            contactEmail: data.contactEmail || "",
            contactPhone: data.contactPhone || "",
            contactWhatsApp: data.contactWhatsApp || "",
            officeAddress: data.officeAddress || "",
            googleMapEmbedCode: data.googleMapEmbedCode || "",
            socialMediaLinks: data.socialMediaLinks || {
              facebook: "",
              twitter: "",
              linkedin: "",
              instagram: "",
            },
            seoMetaTitle: data.seoMetaTitle || "",
            seoMetaDescription: data.seoMetaDescription || "",
            seoKeywords: data.seoKeywords || "",
            isActive: data.isActive,
            businessHours: {
              openingText: data.businessHours?.openingText || "",
              closeText: data.businessHours?.closeText || "",
            },
            logoImage: data.logoImage
              ? {
                  url: data.logoImage.url,
                  publicId: data.logoImage.publicId,
                  altText: data.logoImage.altText || undefined,
                  width: data.logoImage.width || undefined,
                  height: data.logoImage.height || undefined,
                  format: data.logoImage.format || undefined,
                }
              : undefined,
            faviconImage: data.faviconImage
              ? {
                  url: data.faviconImage.url,
                  publicId: data.faviconImage.publicId,
                  altText: data.faviconImage.altText || undefined,
                  width: data.faviconImage.width || undefined,
                  height: data.faviconImage.height || undefined,
                  format: data.faviconImage.format || undefined,
                }
              : undefined,
            metaImage: data.metaImage
              ? {
                  url: data.metaImage.url,
                  publicId: data.metaImage.publicId,
                  altText: data.metaImage.altText || undefined,
                  width: data.metaImage.width || undefined,
                  height: data.metaImage.height || undefined,
                  format: data.metaImage.format || undefined,
                }
              : undefined,
          });
        }
      })
      .catch((error) => {
        toast.error("Failed to load settings data");
        console.error("Error loading settings:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [form]);

  const onSubmit = async (data: UpdateSettingsType) => {
    console.log("Form submitted with data:", data);
    console.log("Form errors:", form.formState.errors);
    setIsSubmitting(true);
    try {
      const submitData: UpdateSettingsRequest = {
        siteTitle: data.siteTitle,
        siteDescription: data.siteDescription,
        contactEmail: data.contactEmail,
        contactPhone: data.contactPhone,
        contactWhatsApp: data.contactWhatsApp,
        officeAddress: data.officeAddress,
        googleMapEmbedCode: data.googleMapEmbedCode,
        socialMediaLinks: data.socialMediaLinks,
        seoMetaTitle: data.seoMetaTitle,
        seoMetaDescription: data.seoMetaDescription,
        seoKeywords: data.seoKeywords,
        isActive: data.isActive,
        businessHours: data.businessHours,
        logoImage: data.logoImage
          ? {
              url: data.logoImage.url,
              publicId: data.logoImage.publicId,
              folder: data.logoImage.folder || "app/settings",
              altText: data.logoImage.altText,
              width: data.logoImage.width,
              height: data.logoImage.height,
              format: data.logoImage.format,
              size: data.logoImage.size,
            }
          : undefined,
        faviconImage: data.faviconImage
          ? {
              url: data.faviconImage.url,
              publicId: data.faviconImage.publicId,
              folder: data.faviconImage.folder || "app/settings",
              altText: data.faviconImage.altText,
              width: data.faviconImage.width,
              height: data.faviconImage.height,
              format: data.faviconImage.format,
              size: data.faviconImage.size,
            }
          : undefined,
        metaImage: data.metaImage
          ? {
              url: data.metaImage.url,
              publicId: data.metaImage.publicId,
              folder: data.metaImage.folder || "app/settings",
              altText: data.metaImage.altText,
              width: data.metaImage.width,
              height: data.metaImage.height,
              format: data.metaImage.format,
              size: data.metaImage.size,
            }
          : undefined,
      };

      const response = await updateSettings(submitData);

      if (response.success) {
        toast.success("Settings updated successfully");
        await queryClient.invalidateQueries({ queryKey: ["settings"] });
      } else {
        toast.error(response.message || "Failed to update settings");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update settings";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <SettingsFormSkeleton />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Typography variant="Bold_H4">General Settings</Typography>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8"
            noValidate
          >
            {/* Basic Information */}
            <div className="space-y-6">
              <div className="space-y-2">
                <Typography variant="Bold_H5">Basic Information</Typography>
                <Separator />
              </div>

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="siteTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Site Title <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter site title"
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
                  name="siteDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Site Description{" "}
                        <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter site description"
                          className="min-h-[100px] resize-none"
                          disabled={isSubmitting}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Images */}
            <div className="space-y-6">
              <div className="space-y-2">
                <Typography variant="Bold_H5">Images</Typography>
                <Separator />
              </div>

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="logoImage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Logo Image</FormLabel>
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
                          folder="app/settings"
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
                  name="faviconImage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Favicon Image</FormLabel>
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
                          folder="app/settings"
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
                  name="metaImage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meta Image (OG Image)</FormLabel>
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
                          folder="app/settings"
                          disabled={isSubmitting}
                          uploadMethod="cloudinary"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              <div className="space-y-2">
                <Typography variant="Bold_H5">Contact Information</Typography>
                <Separator />
              </div>

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="contactEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Contact Email{" "}
                        <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Enter contact email"
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
                  name="contactPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Contact Phone{" "}
                        <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter contact phone"
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
                  name="contactWhatsApp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>WhatsApp Number</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter WhatsApp number"
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
                  name="officeAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Office Address{" "}
                        <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter office address"
                          className="min-h-[80px] resize-none"
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
                  name="googleMapEmbedCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Google Map Embed Code</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter Google Map embed code (iframe)"
                          className="min-h-[100px] resize-none font-mono text-sm"
                          disabled={isSubmitting}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Social Media Links */}
            <div className="space-y-6">
              <div className="space-y-2">
                <Typography variant="Bold_H5">Social Media Links</Typography>
                <Separator />
              </div>

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="socialMediaLinks.facebook"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Facebook URL</FormLabel>
                      <FormControl>
                        <Input
                          type="url"
                          placeholder="https://facebook.com/yourpage"
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
                  name="socialMediaLinks.twitter"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Twitter URL</FormLabel>
                      <FormControl>
                        <Input
                          type="url"
                          placeholder="https://twitter.com/yourhandle"
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
                  name="socialMediaLinks.linkedin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>LinkedIn URL</FormLabel>
                      <FormControl>
                        <Input
                          type="url"
                          placeholder="https://linkedin.com/company/yourcompany"
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
                  name="socialMediaLinks.instagram"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Instagram URL</FormLabel>
                      <FormControl>
                        <Input
                          type="url"
                          placeholder="https://instagram.com/yourhandle"
                          disabled={isSubmitting}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* SEO Settings */}
            <div className="space-y-6">
              <div className="space-y-2">
                <Typography variant="Bold_H5">SEO Settings</Typography>
                <Separator />
              </div>

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="seoMetaTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        SEO Meta Title{" "}
                        <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter SEO meta title"
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
                  name="seoMetaDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        SEO Meta Description{" "}
                        <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter SEO meta description"
                          className="min-h-[100px] resize-none"
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
                  name="seoKeywords"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SEO Keywords</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="keyword1, keyword2, keyword3"
                          disabled={isSubmitting}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Business Hours */}
            <div className="space-y-6">
              <div className="space-y-2">
                <Typography variant="Bold_H5">Business Hours</Typography>
                <Separator />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="businessHours.openingText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Opening Hours</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., Monday - Friday: 9:00 AM - 6:00 PM"
                          className="min-h-[100px] resize-none"
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
                  name="businessHours.closeText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Closed Hours</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., Saturday & Sunday: Closed"
                          className="min-h-[100px] resize-none"
                          disabled={isSubmitting}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="text-sm text-muted-foreground">
                <Typography variant="Regular_H7">
                  Enter your business hours. Opening text for when you're open, and closing text for when you're closed.
                </Typography>
              </div>
            </div>

            {/* Active Status */}
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

            <div className="flex justify-end gap-2">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => {
                  console.log("Current form values:", form.getValues());
                  console.log("Form errors:", form.formState.errors);
                  console.log("Form is valid:", form.formState.isValid);
                }}
              >
                Debug Form
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                onClick={() => {
                  console.log("Submit button clicked");
                  console.log("Form errors before submit:", form.formState.errors);
                }}
              >
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isSubmitting ? "Updating..." : "Update Settings"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
