import * as React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Typography } from "@/components/typography";
import { swapSlider } from "@/api/sliders";
import { Slider } from "@/schemas/sliders";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SwapSliderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sliders: Slider[];
  onSuccess?: () => void;
}

const swapSchema = z.object({
  slider1: z.string().min(1, "Please select first slider"),
  slider2: z.string().min(1, "Please select second slider"),
});

export function SwapSliderDialog({
  open,
  onOpenChange,
  sliders,
  onSuccess,
}: SwapSliderDialogProps) {
  const queryClient = useQueryClient();
  const [isSwapping, setIsSwapping] = React.useState(false);

  const form = useForm({
    resolver: zodResolver(swapSchema),
    defaultValues: {
      slider1: "",
      slider2: "",
    },
  });

  React.useEffect(() => {
    if (open) {
      form.reset({
        slider1: "",
        slider2: "",
      });
    }
  }, [open, form]);

  const onSubmit = async (data: z.infer<typeof swapSchema>) => {
    if (data.slider1 === data.slider2) {
      toast.error("Please select two different sliders");
      return;
    }

    setIsSwapping(true);
    try {
      const response = await swapSlider(
        Number(data.slider1),
        Number(data.slider2)
      );
      if (response.success) {
        toast.success(response.message);
        queryClient.invalidateQueries({ queryKey: ["sliders"] });
        onOpenChange(false);
        onSuccess?.();
      } else {
        toast.error(response.message || "Failed to swap sliders");
      }
    } catch (error) {
      console.error("Swap error:", error);
      toast.error("Failed to swap sliders. Please try again.");
    } finally {
      setIsSwapping(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <Typography variant="Bold_H4" as="span">Swap Sliders</Typography>
          </DialogTitle>
          <DialogDescription>
            <Typography variant="Regular_H6">
              Choose two sliders to swap their order.
            </Typography>
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="slider1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <Typography variant="Medium_H6">Slider 1</Typography>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a slider" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {sliders.map((slider) => (
                        <SelectItem key={slider.id} value={String(slider.id)}>
                          {slider.orderNumber}. {slider.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="slider2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <Typography variant="Medium_H6">Slider 2</Typography>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a slider" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {sliders.map((slider) => (
                        <SelectItem key={slider.id} value={String(slider.id)}>
                          {slider.orderNumber}. {slider.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                variant="outline"
                type="button"
                onClick={() => onOpenChange(false)}
                disabled={isSwapping}
              >
                <Typography variant="Medium_H6">Cancel</Typography>
              </Button>
              <Button type="submit" disabled={isSwapping}>
                <Typography variant="Medium_H6">
                  {isSwapping ? "Swapping..." : "Swap"}
                </Typography>
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
