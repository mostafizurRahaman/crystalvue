"use client";

import { getMe } from "@/api/user/get-me";
import { IUser } from "@/types";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export const useAuth = () => {
  const router = useRouter();
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = useCallback(() => {
    const tokenKey = process.env.NEXT_PUBLIC_TOKEN_KEY!;
    const accessToken = localStorage.getItem(tokenKey);
    return !!accessToken;
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      if (!isAuthenticated()) {
        router.replace("/login");
        setUser(null);
        return;
      }

      setLoading(true);
      try {
        const res = await getMe();

        if (res.success) {
          setUser(res.data!);
          setLoading(false);
        } else {
          setUser(null);
          setLoading(false);
        }
      } catch (err) {
        console.log(err);
        setUser(null);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router, isAuthenticated]);

  return { user, loading };
};
