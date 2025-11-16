import { setAccessToken } from "@/configs/axios";

/**
 * Logout user by clearing the access token from localStorage
 * No API call needed as logout is handled client-side
 */
export function logout(): void {
  setAccessToken(null);
}
