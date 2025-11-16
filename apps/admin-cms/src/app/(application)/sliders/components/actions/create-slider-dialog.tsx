import React from "react";
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
  FormDescription,
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
import { createSlider } from "@/api/sliders";
import {
  createSliderFormSchema,
  CreateSliderFormData,
  CreateSliderApiData,
} from "@/schemas/sliders";
import { SingleImageUpload } from "@/components/uploader/single-image-uploader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CreateSliderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const CreateSliderDialog = ({
  open,
  onOpenChange,
  onSuccess,
}: CreateSliderDialogProps) => {
  const queryClient = useQueryClient();

  const form = useForm({
    resolver: zodResolver(createSliderFormSchema),
    defaultValues: {
      title: "",
      subtitle: "",
      image: {
        url: "",
        publicId: "",
        folder: "app/hero-sliders",
        altText: "",
        width: undefined,
        height: undefined,
        format: undefined,
        size: undefined,
      },
      orderNumber: undefined,
      buttonUrl: "",
      buttonText: "",
      isActive: true,
    },
  });

  const onSubmit = async (data: CreateSliderFormData) => {
    try {
      // The schema validation will handle the image requirement
      // If we get here, the image is valid
      const apiData: CreateSliderApiData = {
        ...data,
        image: data.image,
      };

      const response = await createSlider(apiData);

      if (response.success) {
        toast.success(response.message);
        queryClient.invalidateQueries({ queryKey: ["sliders"] });
        form.reset();
        onOpenChange(false);
        onSuccess?.();
      } else {
        toast.error(response.message || "Failed to create slider");
      }
    } catch (error) {
      console.error("Create slider failed:", error);
      toast.error("Failed to create slider. Please try again.");
    }
  };

  // Handle form validation errors
  const onError = (errors: Record<string, unknown>) => {
    if (errors.image) {
      toast.error("Image is required for slider creation");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full p-6 max-h-[90vh] overflow-y-auto !max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            <Typography variant="Bold_H4" as="span">
              Create New Slider
            </Typography>
          </DialogTitle>
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mt-2">
            <Typography variant="Regular_H7" className="text-blue-800">
              <strong>Note:</strong> Maximum of 15 sliders allowed. Please
              delete existing sliders if you need to add more.
            </Typography>
          </div>
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
                      defaultValue={field.value}
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
                        placeholder="1"
                        {...field}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? Number(e.target.value) : undefined
                          )
                        }
                        disabled={form.formState.isSubmitting}
                      />
                    </FormControl>
                    <FormDescription>
                      <Typography
                        variant="Regular_H7"
                        className="text-muted-foreground"
                        as="span"
                      >
                        Leave empty to add at the end
                      </Typography>
                    </FormDescription>
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
                      defaultValue={String(field.value)}
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
                            publicId: metadata?.publicId || "",
                            folder: "app/hero-sliders",
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
                  {form.formState.isSubmitting
                    ? "Creating..."
                    : "Create Slider"}
                </Typography>
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateSliderDialog;
