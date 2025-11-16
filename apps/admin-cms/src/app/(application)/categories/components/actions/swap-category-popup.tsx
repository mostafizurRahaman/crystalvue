"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, ArrowUpDown } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

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
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Typography } from "@/components/typography";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { z } from "zod";
import { swapCategories } from "@/api/categories/swap-category";
import { Category } from "@/types/category";

// Schema for swap form
const swapCategoriesFormSchema = z
  .object({
    categoryId1: z.string().min(1, "First category is required"),
    categoryId2: z.string().min(1, "Second category is required"),
  })
  .refine((data) => data.categoryId1 !== data.categoryId2, {
    message: "Cannot swap a category with itself",
    path: ["categoryId2"],
  });

type SwapCategoriesFormType = z.infer<typeof swapCategoriesFormSchema>;

interface SwapCategoryPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: Category[];
  onSuccess?: () => void;
}

export function SwapCategoryPopup({
  open,
  onOpenChange,
  categories,
  onSuccess,
}: SwapCategoryPopupProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isSwapping, setIsSwapping] = useState(false);

  const form = useForm<SwapCategoriesFormType>({
    resolver: zodResolver(swapCategoriesFormSchema),
    defaultValues: {
      categoryId1: "",
      categoryId2: "",
    },
  });

  const categoryId1 = form.watch("categoryId1");
  const categoryId2 = form.watch("categoryId2");

  // Get selected categories for display
  const selectedCategory1 = categories.find((c) => c.id === categoryId1);
  const selectedCategory2 = categories.find((c) => c.id === categoryId2);

  const onSubmit = async (data: SwapCategoriesFormType) => {
    setIsSwapping(true);
    try {
      const response = await swapCategories({
        categoryId1: data.categoryId1,
        categoryId2: data.categoryId2,
      });

      if (response.success) {
        toast.success("Categories swapped successfully");
        form.reset();
        onOpenChange(false);
        onSuccess?.();

        // Refresh data
        router.refresh();
        await queryClient.invalidateQueries({ queryKey: ["categories"] });
      } else {
        toast.error(response.message || "Failed to swap categories");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to swap categories";
      toast.error(errorMessage);
    } finally {
      setIsSwapping(false);
    }
  };

  const handleCancel = () => {
    form.reset();
    onOpenChange(false);
  };

  if (!categories || categories.length < 2) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-foreground flex items-center gap-2">
              <ArrowUpDown className="h-5 w-5 text-primary" />
              <Typography variant="Bold_H5">Swap Categories</Typography>
            </DialogTitle>
            <DialogDescription>
              <Typography
                variant="Regular_H6"
                className="text-muted-foreground"
              >
                You need at least 2 categories to perform a swap operation.
              </Typography>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="border-input text-foreground hover:bg-accent"
            >
              <Typography variant="Medium_H7">Close</Typography>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-foreground flex items-center gap-2">
            <ArrowUpDown className="h-5 w-5 text-primary" />
            <Typography variant="Bold_H5">Swap Categories</Typography>
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            <Typography variant="Regular_H6">
              Swap the sort order of two categories
            </Typography>
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Category Selection */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="categoryId1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">
                      <Typography variant="Medium_H6">
                        First Category
                      </Typography>
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-background border-input text-foreground">
                          <SelectValue placeholder="Select first category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem
                            key={category.id}
                            value={category.id}
                            disabled={category.id === categoryId2}
                          >
                            <div className="flex items-center gap-2">
                              <Typography variant="Regular_H7">
                                {category.name}
                              </Typography>
                              <Typography
                                variant="Regular_H7"
                                className="text-muted-foreground"
                              >
                                (Order: {category.sortOrder})
                              </Typography>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-destructive" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="categoryId2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">
                      <Typography variant="Medium_H6">
                        Second Category
                      </Typography>
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-background border-input text-foreground">
                          <SelectValue placeholder="Select second category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem
                            key={category.id}
                            value={category.id}
                            disabled={category.id === categoryId1}
                          >
                            <div className="flex items-center gap-2">
                              <Typography variant="Regular_H7">
                                {category.name}
                              </Typography>
                              <Typography
                                variant="Regular_H7"
                                className="text-muted-foreground"
                              >
                                (Order: {category.sortOrder})
                              </Typography>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-destructive" />
                  </FormItem>
                )}
              />
            </div>

            {/* Preview */}
            {selectedCategory1 && selectedCategory2 && (
              <div className="space-y-2">
                <Typography variant="Medium_H7" className="text-foreground">
                  Preview:
                </Typography>
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-lg border border-border p-3 bg-card">
                    <Typography
                      variant="Regular_H7"
                      className="text-muted-foreground"
                    >
                      {selectedCategory1.name}
                    </Typography>
                    <Typography variant="Bold_H6" className="text-foreground">
                      Order: {selectedCategory2.sortOrder}
                    </Typography>
                  </div>
                  <div className="rounded-lg border border-border p-3 bg-card">
                    <Typography
                      variant="Regular_H7"
                      className="text-muted-foreground"
                    >
                      {selectedCategory2.name}
                    </Typography>
                    <Typography variant="Bold_H6" className="text-foreground">
                      Order: {selectedCategory1.sortOrder}
                    </Typography>
                  </div>
                </div>
              </div>
            )}

            {/* Info Alert */}
            <Alert className="border-primary/50 bg-primary/10">
              <ArrowUpDown className="h-4 w-4" />
              <AlertDescription>
                <Typography variant="Regular_H7">
                  This will swap the sort order of the selected categories. The
                  change will be reflected immediately in the category list.
                </Typography>
              </AlertDescription>
            </Alert>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isSwapping}
                className="border-input text-foreground hover:bg-accent"
              >
                <Typography variant="Medium_H7">Cancel</Typography>
              </Button>
              <Button
                type="submit"
                disabled={isSwapping || !categoryId1 || !categoryId2}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {isSwapping && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                <Typography variant="Medium_H7">
                  {isSwapping ? "Swapping..." : "Swap Categories"}
                </Typography>
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
