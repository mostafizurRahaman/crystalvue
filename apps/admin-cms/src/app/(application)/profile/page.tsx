"use client";

import { ProfileUpdateForm } from "./_components/profile-update-form";
import { SecurityUpdateForm } from "./_components/security-update-form";
import { ProfileSkeleton } from "./_components/profile-skeleton";
import { useGetMe } from "@/hooks/useGetMe";
import { Typography } from "@/components/typography";
import type { IUser } from "@/types";

export default function ProfilePage() {
  const { user, loading, error, refetch } = useGetMe();

  if (loading) {
    return <ProfileSkeleton />;
  }

  if (error || !user) {
    return (
      <div className="container mx-auto py-10">
        <div className="text-center">
          <Typography variant="Bold_H3" className="text-destructive">
            Error loading profile
          </Typography>
          <Typography
            variant="Regular_H6"
            className="text-muted-foreground mt-2"
          >
            {error?.message || "User not found"}
          </Typography>
        </div>
      </div>
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleProfileUpdate = async (updatedUser: IUser) => {
    await refetch();
  };

  return (
    <div className="container mx-auto py-10">
      <div className="space-y-6">
        <div className="space-y-2">
          <Typography variant="Bold_H2">Profile Settings</Typography>
          <Typography variant="Regular_H6" className="text-muted-foreground">
            Manage your profile information and account settings
          </Typography>
        </div>

        <div className="space-y-6">
          <ProfileUpdateForm user={user} onSuccess={handleProfileUpdate} />
          <SecurityUpdateForm onSuccess={handleProfileUpdate} />
        </div>
      </div>
    </div>
  );
}
