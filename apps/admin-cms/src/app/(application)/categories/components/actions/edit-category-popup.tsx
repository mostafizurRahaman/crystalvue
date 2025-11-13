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

import { updateCategorySchema } from "@/schemas/categories/update-category";
import { updateCategory } from "@/api/categories/edit-category";
import {
  createCategoryAddOn,
  removeCategoryAddOn,
} from "@/api/category-add-ons";
import { Category, UpdateCategoryRequest } from "@/types/category";
import { useGetMe } from "@/hooks";

interface EditCategoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: Category;
  onSuccess?: () => void;
}

export function EditCategoryModal({
  open,
  onOpenChange,
  category,
  onSuccess,
}: EditCategoryModalProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addons, setAddons] = useState<string[]>([]);
  const [newAddon, setNewAddon] = useState("");
  const { user, loading } = useGetMe();

  const form = useForm({
    resolver: zodResolver(updateCategorySchema),
    defaultValues: {
      name: "",
      tagline: "",
      description: "",
      cardImage: undefined,
      detailsImage: undefined,
      isPremium: false,
      isRepairingService: false,
      isShowHome: false,
      isActive: true,
      sortOrder: undefined,
      userId: user?.id,
      addons: [],
    },
    mode: "onSubmit",
  });

  // Load category data for edit mode
  useEffect(() => {
    if (category && open) {
      // Populate form with existing category data
      const formData = {
        name: category.name || "",
        tagline: category.tagline || "",
        description: category.description || "",
        cardImage: category.cardImage,
        detailsImage: category.detailsImage,
        isPremium: category.isPremium || false,
        isRepairingService: category.isRepairingService || false,
        isShowHome: category.isShowHome || false,
        isActive: category.isActive ?? true,
        sortOrder: category.sortOrder,
        userId: category.userId || user?.id,
        addons: category.categoryAddons?.map((addon) => addon.addonText) || [],
      };

      console.log("Loading category data:", formData);
      form.reset(formData);
      setAddons(formData.addons);
    }
  }, [category, open, form]);

  const handleAddAddon = async () => {
    if (newAddon.trim() && newAddon.length <= 255) {
      const addonText = newAddon.trim();
      const updatedAddons = [...addons, addonText];
      setAddons(updatedAddons);
      form.setValue("addons", updatedAddons);
      setNewAddon("");

      // Instantly add the addon to the backend
      try {
        await createCategoryAddOn(category.id, { addons: [addonText] });
        toast.success("Add-on added successfully");

        // Add-on successfully added to backend

        // Refresh data
        router.refresh();
        await queryClient.invalidateQueries({ queryKey: ["categories"] });
      } catch (error) {
        // Revert the local state if API call fails
        const revertedAddons = addons;
        setAddons(revertedAddons);
        form.setValue("addons", revertedAddons);

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
    form.setValue("addons", updatedAddons);

    // Instantly remove the addon from the backend
    try {
      await removeCategoryAddOn(category.id, { addonTexts: [addonToRemove] });
      toast.success("Add-on removed successfully");

      // Add-on successfully removed from backend

      // Refresh data
      router.refresh();
      await queryClient.invalidateQueries({ queryKey: ["categories"] });
    } catch (error) {
      // Revert the local state if API call fails
      setAddons(addons);
      form.setValue("addons", addons);

      const errorMessage =
        error instanceof Error ? error.message : "Failed to remove add-on";
      toast.error(errorMessage);
    }
  };

  const onSubmit = async (data: UpdateCategoryRequest) => {
    setIsSubmitting(true);
    try {
      console.log("Submitting form data:", data);

      // Ensure required fields are not empty
      const submitData = {
        ...data,
        tagline: data.tagline?.trim() || "",
        description: data.description?.trim() || "",
        userId: user?.id,
      };

      // Remove addons from the data since we handle them separately
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { addons, ...categoryData } = submitData;

      console.log("Category data to send:", categoryData);

      await updateCategory(category.id, categoryData);
      toast.success("Category updated successfully");

      // Add-ons are now handled instantly, no need to manage them here

      form.reset();
      setAddons([]);
      onOpenChange(false);
      onSuccess?.();

      // Refresh data
      router.refresh();
      await queryClient.invalidateQueries({ queryKey: ["categories"] });
    } catch (error) {
      console.error("Form submission error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update category";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onError = (errors: FieldErrors<UpdateCategoryRequest>) => {
    console.error("Form validation errors:", errors);
    toast.error("Please fix the validation errors in the form");
  };

  const handleCancel = () => {
    form.reset();
    setAddons([]);
    setNewAddon("");
    onOpenChange(false);
  };

  // Add debugging to see form state
  console.log("Form state:", {
    errors: form.formState.errors,
    isDirty: form.formState.isDirty,
    isValid: form.formState.isValid,
    isSubmitting: isSubmitting,
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            <Typography variant="Bold_H4" as="span">
              Edit Category
            </Typography>
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className=" gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                            placeholder="Enter category name"
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
                    name="tagline"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground">
                          Tagline <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter category tagline"
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
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground">
                          Description
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter category description"
                            className="bg-background border-input text-foreground placeholder:text-muted-foreground min-h-[100px] resize-none"
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
                    name="sortOrder"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground">
                          Sort Order
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Enter sort order"
                            className="bg-background border-input text-foreground placeholder:text-muted-foreground"
                            disabled={isSubmitting}
                            value={field.value ?? ""}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value === "") {
                                field.onChange(null);
                              } else {
                                const parsed = parseInt(value, 10);
                                if (!isNaN(parsed)) {
                                  field.onChange(parsed);
                                } else {
                                  field.onChange(null);
                                }
                              }
                            }}
                            onFocus={(e) => e.target.select()}
                          />
                        </FormControl>
                        <FormMessage className="text-destructive" />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="space-y-6">
                  {/* Settings */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-foreground">
                      Settings
                    </h3>

                    <FormField
                      control={form.control}
                      name="isPremium"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border border-border p-4 bg-card">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base text-foreground">
                              Premium Category
                            </FormLabel>
                            <FormDescription className="text-muted-foreground">
                              Mark this category as premium
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
                      name="isRepairingService"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border border-border p-4 bg-card">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base text-foreground">
                              Repairing Service
                            </FormLabel>
                            <FormDescription className="text-muted-foreground">
                              Category offers repairing services
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
                      name="isShowHome"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border border-border p-4 bg-card">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base text-foreground">
                              Show on Home
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
              </div>

              <div className="my-5">
                <Separator className="bg-border " />
              </div>
              {/* Left Column - Basic Information & Images */}

              <div className="space-y-4">
                <h3 className="text-sm font-medium text-foreground">Images</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="cardImage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground">
                          Card Image
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
                            folder="categories/cards"
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
                    name="detailsImage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground">
                          Details Image
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
                            folder="categories/details"
                            disabled={isSubmitting}
                            uploadMethod="cloudinary"
                          />
                        </FormControl>

                        <FormMessage className="text-destructive" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="my-5">
                <Separator className="bg-border " />
              </div>

              {/* Addons */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-foreground">
                    Category Addons
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
                {isSubmitting ? "Updating..." : "Update Category"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
