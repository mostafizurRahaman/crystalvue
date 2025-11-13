"use client";

import * as React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, PlusCircle } from "lucide-react";
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
import { Separator } from "@/components/ui/separator";
import { SingleImageUpload } from "@/components/uploader/single-image-uploader";

import {
  createCategorySchema,
  CreateCategoryType,
} from "@/schemas/categories/create-category";
import { createCategory } from "@/api/categories/create-category";
import { CreateCategoryRequest, ImageMetadata } from "@/types/category";
import { useGetMe } from "@/hooks";

export function AddCategoryPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addons, setAddons] = useState<string[]>([]);
  const [newAddon, setNewAddon] = useState("");
  const { user, loading: userLoading } = useGetMe();

  const router = useRouter();
  const queryClient = useQueryClient();

  const form = useForm({
    resolver: zodResolver(createCategorySchema),
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
  });

  const handleAddAddon = () => {
    if (newAddon.trim() && newAddon.length <= 255) {
      const updatedAddons = [...addons, newAddon.trim()];
      setAddons(updatedAddons);
      form.setValue("addons", updatedAddons);
      setNewAddon("");
    } else if (newAddon.length > 255) {
      toast.error("Addon text cannot exceed 255 characters");
    }
  };

  const handleRemoveAddon = (index: number) => {
    const updatedAddons = addons.filter((_, i) => i !== index);
    setAddons(updatedAddons);
    form.setValue("addons", updatedAddons);
  };

  const onSubmit = async (data: CreateCategoryType) => {
    setIsSubmitting(true);
    try {
      // Transform data to match API requirements
      const submitData: CreateCategoryRequest = {
        name: data.name as string,
        tagline: data.tagline as string | undefined,
        description: data.description as string | undefined,
        cardImage: data.cardImage as ImageMetadata | undefined,
        detailsImage: data.detailsImage as ImageMetadata | undefined,
        isPremium: data.isPremium as boolean | undefined,
        isRepairingService: data.isRepairingService as boolean | undefined,
        isShowHome: data.isShowHome as boolean | undefined,
        isActive: data.isActive as boolean | undefined,
        sortOrder: data.sortOrder as number | undefined,
        userId: data.userId as string | undefined,
        addons: data.addons as string[] | undefined,
      };
      await createCategory(submitData);
      toast.success("Category created successfully");

      // Reset form and close modal
      form.reset();
      setAddons([]);
      setNewAddon("");
      setIsOpen(false);

      // Refresh data
      router.refresh();
      await queryClient.invalidateQueries({ queryKey: ["categories"] });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create category";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    form.reset();
    setAddons([]);
    setNewAddon("");
    setIsOpen(false);
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)} size="sm">
        <PlusCircle className="mr-2 h-4 w-4" />
        <Typography variant="Medium_H7">Add Category</Typography>
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="!max-w-7xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              <Typography variant="Bold_H4" as="span">
                Create New Category
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
                            Tagline
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
                              {...field}
                              onChange={(e) => {
                                const value = e.target.value;
                                field.onChange(
                                  value === "" ? undefined : parseInt(value)
                                );
                              }}
                              value={field.value ?? ""}
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
                  <h3 className="text-sm font-medium text-foreground">
                    Images
                  </h3>

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
                  <h3 className="text-sm font-medium text-foreground">
                    Category Addons
                  </h3>

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
                          <span className="text-sm text-foreground">
                            {addon}
                          </span>
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
                  {isSubmitting ? "Creating..." : "Create Category"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
