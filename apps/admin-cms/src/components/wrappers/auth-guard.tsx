"use client";

import { useAuth } from "@/hooks";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  console.log({ user });

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center text-lg">
        Loading user data...
      </div>
    );

  if (!user) return null;

  return <div>{children}</div>;
}
