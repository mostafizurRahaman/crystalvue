"use client";

import { getMe } from "@/api/user/get-me";
import { IUser } from "@/types";
import { useCallback, useEffect, useState } from "react";

interface UseGetMeOptions {
  immediate?: boolean;
  onSuccess?: (user: IUser) => void;
  onError?: (error: Error) => void;
}

interface UseGetMeResult {
  user: IUser | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  reset: () => void;
}

export const useGetMe = (options: UseGetMeOptions = {}): UseGetMeResult => {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const { immediate = true, onSuccess, onError } = options;

  const fetchUser = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await getMe();

      if (res.success && res.data) {
        setUser(res.data);
        onSuccess?.(res.data);
      } else {
        const error = new Error("User data not found");
        setError(error);
        onError?.(error);
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to fetch user information");
      setError(error);
      setUser(null);
      onError?.(error);
    } finally {
      setLoading(false);
    }
  }, [onSuccess, onError]);

  const reset = useCallback(() => {
    setUser(null);
    setError(null);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (immediate) {
      fetchUser();
    }
  }, [immediate, fetchUser]);

  return {
    user,
    loading,
    error,
    refetch: fetchUser,
    reset,
  };
};
