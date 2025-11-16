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

            {/* Tagline skeleton - matches Regular_H6 with leading-relaxed */}
            <div className="space-y-2 max-w-md">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-5/6" />
              <Skeleton className="h-5 w-4/6" />
            </div>

            {/* Social Icons */}
            <div className="space-y-3">
              {/* Follow Us heading - matches Medium_H6 */}
              <Skeleton className="h-6 w-28 mb-3" />
              <div className="flex gap-2">
                {[...Array(4)].map((_, index) => (
                  <Skeleton key={index} className="w-10 h-10 rounded-lg" />
                ))}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            {/* Title - matches SemiBold_H5 with ChevronRight */}
            <div className="flex items-center gap-2 mb-4">
              <Skeleton className="w-4 h-4 rounded" />
              <Skeleton className="h-6 w-28" />
            </div>

            {/* Links - matches Regular_H6, 6 items */}
            <ul className="space-y-2">
              {[...Array(6)].map((_, index) => (
                <li key={index}>
                  <Skeleton className="h-5 w-32" />
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            {/* Title - matches SemiBold_H5 with ChevronRight */}
            <div className="flex items-center gap-2 mb-4">
              <Skeleton className="w-4 h-4 rounded" />
              <Skeleton className="h-6 w-32" />
            </div>

            {/* Service items - matches Regular_H6, 6 items */}
            <ul className="space-y-2">
              {[...Array(6)].map((_, index) => (
                <li key={index}>
                  <Skeleton className="h-5 w-full max-w-[200px]" />
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            {/* Title - matches SemiBold_H5 with ChevronRight */}
            <div className="flex items-center gap-2 mb-4">
              <Skeleton className="w-4 h-4 rounded" />
              <Skeleton className="h-6 w-28" />
            </div>

            {/* Contact items - matches Regular_H6, ordered as in actual footer */}
            <ul className="space-y-3">
              {/* Address - can be multi-line */}
              <li className="flex items-start gap-2">
                <Skeleton className="w-4 h-4 mt-0.5 shrink-0 rounded" />
                <div className="flex-1 space-y-1">
                  <Skeleton className="h-5 w-full max-w-[200px]" />
                  <Skeleton className="h-5 w-4/5 max-w-[160px]" />
                </div>
              </li>

              {/* Email */}
              <li className="flex items-start gap-2">
                <Skeleton className="w-4 h-4 mt-0.5 shrink-0 rounded" />
                <Skeleton className="h-5 w-44 max-w-[220px]" />
              </li>

              {/* Phone */}
              <li className="flex items-start gap-2">
                <Skeleton className="w-4 h-4 mt-0.5 shrink-0 rounded" />
                <Skeleton className="h-5 w-32 max-w-[160px]" />
              </li>

              {/* WhatsApp */}
              <li className="flex items-start gap-2">
                <Skeleton className="w-4 h-4 mt-0.5 shrink-0 rounded" />
                <Skeleton className="h-5 w-40 max-w-[200px]" />
              </li>

              {/* Business hours - can be multi-line */}
              <li className="flex items-start gap-2">
                <Skeleton className="w-4 h-4 mt-0.5 shrink-0 rounded" />
                <div className="flex-1 space-y-1">
                  <Skeleton className="h-5 w-36 max-w-[180px]" />
                  <Skeleton className="h-5 w-32 max-w-[160px]" />
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <Separator className="my-8 opacity-50" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Copyright - matches Regular_H6 */}
          <Skeleton className="h-5 w-64 md:w-80" />

          {/* Links - matches Regular_H6 */}
          <div className="flex flex-wrap items-center gap-4">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="w-1 h-1 rounded-full" />
            <Skeleton className="h-5 w-32" />
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
