"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { FieldErrors, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useGetMe } from "@/hooks";

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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { SingleImageUpload } from "@/components/uploader/single-image-uploader";

import { createServiceSchema } from "@/schemas/services";
import { createService } from "@/api/services";
import { addServiceAddon } from "@/api/services-add-on";
import { CreateServiceRequest } from "@/types";
import { AsyncSearchableSelect } from "@/components/async-searchable-select";
import { getAllCategories } from "@/api/categories";

interface CreateServiceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function CreateServiceModal({
  open,
  onOpenChange,
  onSuccess,
}: CreateServiceModalProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addons, setAddons] = useState<string[]>([]);
  const [newAddon, setNewAddon] = useState("");
  const { loading: userLoading } = useGetMe();

  // Custom fetch function for categories
  const fetchCategoriesOptions = React.useCallback(async (search?: string) => {
    try {
      const response = await getAllCategories({
        page: 1,
        limit: 10, // Limit for better UX
        search: search?.trim(),
        isActive: true,
      });

      if (response.success && Array.isArray(response.data)) {
        return {
          data: response.data.map((category) => ({
            value: category.id,
            label: category.name,
          })),
          success: true,
        };
      }

      return { data: [], success: false };
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      return { data: [], success: false };
    }
  }, []);

  const form = useForm({
    resolver: zodResolver(createServiceSchema),
    defaultValues: {
      name: "",
      tagline: "",
      description: "",
      image: undefined,
      price: 0,
      isPremium: false,
      isActive: true,
      parentCategoryId: "",
    },
    mode: "onSubmit",
  });

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      form.reset();
      setAddons([]);
      setNewAddon("");
    }
  }, [open, form]);

  const handleAddAddon = async () => {
    if (newAddon.trim() && newAddon.length <= 255) {
      const addonText = newAddon.trim();
      const updatedAddons = [...addons, addonText];
      setAddons(updatedAddons);
      setNewAddon("");
    } else if (newAddon.length > 255) {
      toast.error("Addon text cannot exceed 255 characters");
    }
  };

  const handleRemoveAddon = (index: number) => {
    const updatedAddons = addons.filter((_, i) => i !== index);
    setAddons(updatedAddons);
  };

  const onSubmit: SubmitHandler<CreateServiceRequest> = async (data) => {
    if (userLoading) return;

    setIsSubmitting(true);
    try {
      console.log("Submitting form data:", data);

      // Ensure required fields are not empty
      const submitData = {
        ...data,
        tagline: data.tagline?.trim() || "",
        description: data.description?.trim() || "",
        price: data.price || 0,
      };

      // Create the service first
      const serviceResponse = await createService(submitData);
      toast.success("Service created successfully");
      console.log("Service response:", { serviceResponse });

      // Add service add-ons if any
      if (addons.length > 0) {
        try {
          const addonPromises = addons.map((addonText) =>
            addServiceAddon(serviceResponse.data?.id, {
              addonText,
              isActive: true,
            }).catch((error) => {
              console.error(`Failed to add addon: ${addonText}`, error);
              toast.error(`Failed to add addon: ${addonText}`);
              return null; // Return null for failed addons
            })
          );

          const results = await Promise.all(addonPromises);
          const successfulAddons = results.filter((result) => result !== null);

          if (successfulAddons.length > 0) {
            toast.success(
              `${successfulAddons.length} add-ons added successfully`
            );
          }
        } catch (error) {
          console.error("Error adding add-ons:", error);
          toast.error("Failed to add some add-ons");
        }
      }

      form.reset();
      setAddons([]);
      setNewAddon("");
      onOpenChange(false);
      onSuccess?.();

      // Refresh data
      router.refresh();
      await queryClient.invalidateQueries({ queryKey: ["services"] });
      await queryClient.invalidateQueries({ queryKey: ["categories"] });
    } catch (error) {
      console.error("Form submission error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create service";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onError = (errors: FieldErrors<CreateServiceRequest>) => {
    console.error("Form validation errors:", errors);
    toast.error("Please fix the validation errors in the form");
  };

  const handleCancel = () => {
    form.reset();
    setAddons([]);
    setNewAddon("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            <Typography variant="Bold_H4" as="span">
              Create Service
            </Typography>
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, onError)}
            className="space-y-6"
          >
            <div className=" gap-6">
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-foreground">
                  Basic Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                            placeholder="Enter service name"
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
                    name="parentCategoryId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground">
                          Category <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <AsyncSearchableSelect
                            placeholder="Select a category"
                            searchPlaceholder="Search categories..."
                            fetchOptions={fetchCategoriesOptions}
                            value={field.value}
                            onValueChange={field.onChange}
                            disabled={isSubmitting}
                            className="w-full"
                            pageSize={50}
                            debounceMs={300}
                            enableInitialLoad={true}
                          />
                        </FormControl>
                        <FormMessage className="text-destructive" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tagline"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground">
                          Tagline
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter service tagline"
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
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground">Price</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="Enter service price"
                            className="bg-background border-input text-foreground placeholder:text-muted-foreground"
                            disabled={isSubmitting}
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseFloat(e.target.value) || 0)
                            }
                          />
                        </FormControl>
                        <FormMessage className="text-destructive" />
                      </FormItem>
                    )}
                  />
                  <div className=" md:col-span-2">
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-foreground">
                            Description
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Enter service description"
                              className="bg-background border-input text-foreground placeholder:text-muted-foreground min-h-[100px] resize-none"
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
              </div>
              <div className="my-5">
                <Separator className="bg-border " />
              </div>
              <div className="space-y-6">
                {/* Settings */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-foreground">
                    Settings
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="isPremium"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border border-border p-4 bg-card">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base text-foreground">
                              Premium Service
                            </FormLabel>
                            <FormDescription className="text-muted-foreground">
                              Mark this service as premium
                            </FormDescription>
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

                    <FormField
                      control={form.control}
                      name="isActive"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border border-border p-4 bg-card">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base text-foreground">
                              Active Status
                            </FormLabel>
                            <FormDescription className="text-muted-foreground">
                              Service will be visible to users
                            </FormDescription>
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
              </div>
              <div className="my-5">
                <Separator className="bg-border " />
              </div>
              {/* Image */}
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">
                        Service Image
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
                          folder="services"
                          disabled={isSubmitting}
                          uploadMethod="cloudinary"
                        />
                      </FormControl>
                      <FormMessage className="text-destructive" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="my-5">
                <Separator className="bg-border " />
              </div>

              {/* Addons */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-foreground">
                    Service Addons
                  </h3>
                </div>

                <div className="flex gap-2">
                  <Input
                    placeholder="Enter addon text (max 255 chars)"
                    value={newAddon}
                    onChange={(e) => setNewAddon(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddAddon();
                      }
                    }}
                    className="bg-background border-input text-foreground placeholder:text-muted-foreground"
                    disabled={isSubmitting}
                    maxLength={255}
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleAddAddon}
                    disabled={!newAddon.trim() || isSubmitting}
                    className="bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  >
                    Add
                  </Button>
                </div>

                {addons.length > 0 && (
                  <div className="space-y-2">
                    {addons.map((addon, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 rounded-lg border border-border bg-card"
                      >
                        <span className="text-sm text-foreground">{addon}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveAddon(index)}
                          disabled={isSubmitting}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
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
                disabled={isSubmitting || userLoading}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isSubmitting ? "Creating..." : "Create Service"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
