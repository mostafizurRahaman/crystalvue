"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProfileImageUpload } from "@/components/uploader/profile-image-uploader";
import {
  profileUpdateSchema,
  type ProfileUpdateFormData,
} from "@/schemas/profile/update-profile";
import { updateMe } from "@/api/user/update-me";
import type { IUser } from "@/types";

interface ProfileUpdateFormProps {
  user: IUser;
  onSuccess?: (updatedUser: IUser) => void;
}

export function ProfileUpdateForm({ user, onSuccess }: ProfileUpdateFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdatingImage, setIsUpdatingImage] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(
    user.profileUrl || null
  );

  const form = useForm<ProfileUpdateFormData>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      name: user.name || "",
      email: user.email || "",
    },
  });

  // Sync profile image URL when user prop changes
  useEffect(() => {
    setProfileImageUrl(user.profileUrl || null);
  }, [user.profileUrl]);

  // Handle profile image upload
  const handleImageUpload = async (url: string | null) => {
    setIsUpdatingImage(true);
    try {
      const response = await updateMe({ profileUrl: url });

      if (response.success && response.data) {
        setProfileImageUrl(response.data.profileUrl || null);
        toast.success("Profile picture updated successfully");
        onSuccess?.(response.data);
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to update profile picture";
      toast.error(message);
    } finally {
      setIsUpdatingImage(false);
    }
  };

  const onSubmit = async (data: ProfileUpdateFormData) => {
    setIsLoading(true);
    try {
      // Remove empty strings and undefined values
      const payload: {
        name?: string;
        email?: string;
      } = {};

      if (data.name && data.name !== user.name) {
        payload.name = data.name;
      }
      if (data.email && data.email !== user.email) {
        payload.email = data.email;
      }

      if (Object.keys(payload).length === 0) {
        toast.info("No changes to save");
        return;
      }

      // Call update API
      const response = await updateMe(payload);

      if (response.success && response.data) {
        toast.success("Profile updated successfully");
        onSuccess?.(response.data);
        form.reset({
          name: response.data.name,
          email: response.data.email,
        });
        // Update profile image URL if it changed
        if (response.data.profileUrl !== profileImageUrl) {
          setProfileImageUrl(response.data.profileUrl || null);
        }
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to update profile";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Edit Profile</CardTitle>
        <CardDescription>
          Update your profile information and account settings
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Profile Image Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">Profile Picture</h3>
              </div>
              <ProfileImageUpload
                value={profileImageUrl || undefined}
                onImageUpload={handleImageUpload}
                disabled={isUpdatingImage}
              />
            </div>

            {/* Basic Information Section */}
            <div className="space-y-4 pt-4 border-t">
              <h3 className="text-sm font-semibold">Basic Information</h3>

              {/* Name Field */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your full name"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormDescription>
                      Your name as it appears in your account
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email Field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter your email address"
                        {...field}
                        disabled
                      />
                    </FormControl>
                    <FormDescription>
                      We&apos;ll use this for account notifications and login
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Form Actions */}
            <div className="flex gap-3 pt-6 border-t">
              <Button
                type="submit"
                disabled={isLoading}
                className="min-w-[120px]"
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
