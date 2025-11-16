"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { FieldErrors, SubmitHandler, useForm } from "react-hook-form";
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

import { updateServiceSchema } from "@/schemas/services";
import { updateService } from "@/api/services";
import { addServiceAddon, removeServiceAddon } from "@/api/services-add-on";
import { Service, UpdateServiceRequest } from "@/types";
import { AsyncSearchableSelect } from "@/components/async-searchable-select";
import { getAllCategories } from "@/api/categories";

interface EditServiceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service: Service;
  onSuccess?: () => void;
}

export function EditServiceModal({
  open,
  onOpenChange,
  service,
  onSuccess,
}: EditServiceModalProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addons, setAddons] = useState<string[]>([]);
  const [newAddon, setNewAddon] = useState("");

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
    resolver: zodResolver(updateServiceSchema),
    defaultValues: {
      parentCategoryId: "",
      name: "",
      tagline: "",
      description: "",
      image: undefined,
      price: 0,
      isPremium: false,
      isActive: true,
    },
    mode: "onSubmit",
  });

  // Load service data for edit mode
  useEffect(() => {
    if (service && open) {
      // Populate form with existing service data
      const formData = {
        parentCategoryId: service.parentCategoryId,
        name: service.name || "",
        tagline: service?.tagline || "",
        description: service.description || "",
        image: service.image,
        price: service.price,
        isPremium: service.isPremium || false,
        isActive: service.isActive ?? true,
      };

      console.log("Loading service data:", formData);
      form.reset(formData);
      setAddons(service.serviceAddons?.map((addon) => addon.addonText) || []);
    }
  }, [service, open, form]);

  const handleAddAddon = async () => {
    if (newAddon.trim() && newAddon.length <= 255) {
      const addonText = newAddon.trim();
      const updatedAddons = [...addons, addonText];
      setAddons(updatedAddons);
      setNewAddon("");

      // Instantly add the addon to the backend
      try {
        await addServiceAddon(service.id, { addonText });
        toast.success("Add-on added successfully");

        // Refresh data
        router.refresh();
        await queryClient.invalidateQueries({ queryKey: ["services"] });
      } catch (error) {
        // Revert the local state if API call fails
        const revertedAddons = addons;
        setAddons(revertedAddons);

        const errorMessage =
          error instanceof Error ? error.message : "Failed to add add-on";
        toast.error(errorMessage);
      }
    } else if (newAddon.length > 255) {
      toast.error("Addon text cannot exceed 255 characters");
    }
  };

  const handleRemoveAddon = async (index: number) => {
    const addonToRemove = addons[index];
    const updatedAddons = addons.filter((_, i) => i !== index);
    setAddons(updatedAddons);

    // Instantly remove the addon from the backend
    try {
      await removeServiceAddon(addonToRemove);
      toast.success("Add-on removed successfully");
    } catch {
      toast.error("Failed to remove add-on");
    }
  };

  const onSubmit: SubmitHandler<UpdateServiceRequest> = async (
    data: UpdateServiceRequest
  ) => {
    setIsSubmitting(true);
    try {
      console.log("Submitting form data:", data);

      // Ensure required fields are not empty
      const submitData = {
        ...data,
        tagline: data.tagline?.trim() || "",
        description: data.description?.trim() || "",
      };

      console.log("Service data to send:", submitData);

      await updateService(service.id, submitData);
      toast.success("Service updated successfully");

      form.reset();
      setAddons([]);
      setNewAddon("");
      onOpenChange(false);
      onSuccess?.();

      // Refresh data
      router.refresh();
      await queryClient.invalidateQueries({ queryKey: ["services"] });
    } catch (error) {
      console.error("Form submission error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update service";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onError = (errors: FieldErrors<UpdateServiceRequest>) => {
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
      <DialogContent className="!max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            <Typography variant="Bold_H4" as="span">
              Edit Service
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
                            disabled
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
                disabled={isSubmitting}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isSubmitting ? "Updating..." : "Update Service"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
