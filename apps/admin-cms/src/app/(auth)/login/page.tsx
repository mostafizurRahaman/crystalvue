"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff, Chrome, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Typography } from "@/components/typography";
import IcoLogo from "@/assets/icons/ico-logo";
import loginBanner from "@/assets/images/login-banner.jpg";
import Image from "next/image";
import { loginUser } from "@/api/auth/login";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { setAccessToken } from "@/configs/axios";

// Form validation schema
const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const router = useRouter();

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      const res = await loginUser(data);

      console.log(res);

      if (res.success) {
        setTimeout(() => {}, 2000);
        // Store JWT token - based on your API response, the entire user data contains token info
        // We'll need to get the actual access token from your backend or use the id as a placeholder
        // For now, we'll use the user.id as a temporary identifier
        setAccessToken(res.data.accessToken!);
        toast.success("Logged in successfully!");
        router.replace("/");
      } else {
        toast.error(res.message || "Login failed");
      }
    } catch (err: unknown) {
      let errorMessage: string;
      if (err && typeof err === "object" && "response" in err) {
        const axiosError = err as {
          response?: { data?: { message?: string } };
          message?: string;
        };
        errorMessage =
          axiosError.response?.data?.message ||
          axiosError.message ||
          "Login failed. Please try again.";
      } else if (err instanceof Error) {
        errorMessage = err.message;
      } else {
        errorMessage = "Login failed. Please try again.";
      }
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Banner */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <Image
          src={loginBanner}
          alt="Login banner"
          fill
          sizes="50vw"
          quality={90}
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/95 via-primary/85 to-primary/70" />
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-8">
          {/* Logo/Brand */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center mb-8">
              <IcoLogo />
            </div>
            <Typography variant="Bold_H2" className="text-foreground">
              Welcome back
            </Typography>
            <Typography variant="Regular_H6" className="text-muted-foreground">
              Enter your credentials to access your account
            </Typography>
          </div>

          {/* Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <Typography
                        variant="Medium_H6"
                        className="text-foreground"
                      >
                        Work email
                      </Typography>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="you@company.com"
                        className="h-11"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>
                        <Typography
                          variant="Medium_H6"
                          className="text-foreground"
                        >
                          Password
                        </Typography>
                      </FormLabel>
                      <Link
                        href="/forgot-password"
                        className="text-primary hover:text-primary/80 transition-colors"
                      >
                        <Typography variant="Regular_H7">
                          Forgot password?
                        </Typography>
                      </Link>
                    </div>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          className="h-11 pr-10"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={togglePasswordVisibility}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          aria-label={
                            showPassword ? "Hide password" : "Show password"
                          }
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Remember me checkbox */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="remember"
                  className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                />
                <label htmlFor="remember">
                  <Typography
                    variant="Regular_H7"
                    className="text-foreground cursor-pointer"
                  >
                    Keep me signed in
                  </Typography>
                </label>
              </div>

              <Button
                type="submit"
                className="w-full h-11 cursor-pointer"
                disabled={isLoading}
              >
                <Typography
                  variant="SemiBold_H6"
                  className="text-primary-foreground"
                >
                  {isLoading ? "Signing in..." : "Sign in"}
                </Typography>
              </Button>
            </form>
          </Form>

          {/* Sign up link */}
          <div className="flex items-center justify-center">
            <Typography variant="Regular_H6" className="text-muted-foreground">
              New to our platform?{" "}
              <Link
                href="/register"
                className="font-medium text-primary hover:text-primary/80 transition-colors"
              >
                Create an account
              </Link>
            </Typography>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <Typography
                variant="Regular_H7"
                className="px-2 bg-background text-muted-foreground"
              >
                Or sign in with
              </Typography>
            </div>
          </div>

          {/* Social Login Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="h-11 cursor-pointer"
              type="button"
            >
              <Chrome className="w-5 h-5 mr-2" />
              <Typography variant="Medium_H6">Google</Typography>
            </Button>

            <Button
              variant="outline"
              className="h-11 cursor-pointer"
              type="button"
            >
              <Github className="w-5 h-5 mr-2 " />
              <Typography variant="Medium_H6">GitHub</Typography>
            </Button>
          </div>

          {/* Trust footer */}
          <div className="text-center pt-4">
            <Typography variant="Regular_H7" className="text-muted-foreground">
              Protected by industry-leading security standards
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
}
