// components/layout/FooterSkeleton.tsx
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export function FooterSkeleton() {
  return (
    <footer className="relative bg-card border-t border-border overflow-hidden">
      {/* Decorative gradient orb */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/5 rounded-full blur-3xl" />

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-4">
          {/* Company Info - Spans 2 columns on lg */}
          <div className="lg:col-span-2 space-y-4">
            {/* Logo skeleton */}
            <Skeleton className="w-32 h-12" />

            {/* Tagline skeleton */}
            <div className="space-y-2 max-w-md">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
            </div>

            {/* Social Icons */}
            <div className="space-y-3 pt-2">
              <Skeleton className="h-5 w-24" />
              <div className="flex gap-2">
                {[...Array(4)].map((_, index) => (
                  <Skeleton key={index} className="w-10 h-10 rounded-lg" />
                ))}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            {/* Title */}
            <div className="flex items-center gap-2 mb-4">
              <Skeleton className="w-4 h-4 rounded" />
              <Skeleton className="h-6 w-28" />
            </div>

            {/* Links */}
            <div className="space-y-2">
              {[...Array(6)].map((_, index) => (
                <Skeleton key={index} className="h-4 w-24" />
              ))}
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            {/* Title */}
            <div className="flex items-center gap-2 mb-4">
              <Skeleton className="w-4 h-4 rounded" />
              <Skeleton className="h-6 w-32" />
            </div>

            {/* Service items */}
            <div className="space-y-2">
              {[...Array(6)].map((_, index) => (
                <Skeleton key={index} className="h-4 w-full" />
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            {/* Title */}
            <div className="flex items-center gap-2 mb-4">
              <Skeleton className="w-4 h-4 rounded" />
              <Skeleton className="h-6 w-28" />
            </div>

            {/* Contact items */}
            <div className="space-y-3">
              {/* Address */}
              <div className="flex items-start gap-2">
                <Skeleton className="w-4 h-4 mt-0.5 flex-shrink-0 rounded" />
                <div className="flex-1 space-y-1">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-4/5" />
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-2">
                <Skeleton className="w-4 h-4 mt-0.5 flex-shrink-0 rounded" />
                <Skeleton className="h-3 w-32" />
              </div>

              {/* WhatsApp */}
              <div className="flex items-start gap-2">
                <Skeleton className="w-4 h-4 mt-0.5 flex-shrink-0 rounded" />
                <Skeleton className="h-3 w-40" />
              </div>

              {/* Email */}
              <div className="flex items-start gap-2">
                <Skeleton className="w-4 h-4 mt-0.5 flex-shrink-0 rounded" />
                <Skeleton className="h-3 w-44" />
              </div>

              {/* Business hours */}
              <div className="flex items-start gap-2">
                <Skeleton className="w-4 h-4 mt-0.5 flex-shrink-0 rounded" />
                <div className="flex-1 space-y-1">
                  <Skeleton className="h-3 w-36" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <Separator className="my-8 opacity-50" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Copyright */}
          <Skeleton className="h-4 w-64" />

          {/* Links */}
          <div className="flex flex-wrap items-center gap-4">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="w-1 h-1 rounded-full" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
      </div>

      {/* Floating WhatsApp Button Skeleton */}
      <div className="fixed bottom-24 left-8 z-50">
        <Skeleton className="w-14 h-14 rounded-full" />
      </div>

      {/* Back to top button Skeleton */}
      <div className="fixed bottom-8 right-8 z-50">
        <Skeleton className="w-12 h-12 rounded-full" />
      </div>
    </footer>
  );
}
