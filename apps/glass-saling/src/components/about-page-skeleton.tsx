import { Skeleton } from "@/components/ui/skeleton";

export function AboutPageSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section Skeleton */}
      <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
        {/* Background Image Skeleton */}
        <div className="absolute inset-0">
          <Skeleton className="w-full h-full" />
          {/* Gradient Overlay Placeholder */}
          <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-transparent to-transparent" />
        </div>

        {/* Animated Background Elements Skeleton */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        </div>

        {/* Hero Content Skeleton */}
        <div className="relative h-full container mx-auto px-4 flex items-center">
          <div className="w-full space-y-6">
            {/* Badge Skeleton */}
            <div className="inline-flex items-center gap-2 glass-card px-4 py-2 rounded-full mb-6">
              <Skeleton className="w-4 h-4 rounded-full bg-primary/20" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>

            {/* Title Skeleton - Large responsive text */}
            <div className="space-y-3 mb-6">
              <Skeleton className="h-14 md:h-16 lg:h-20 w-full max-w-4xl rounded-lg" />
            </div>

            {/* Subtitle Skeleton - Medium size */}
            <div className="mb-8 max-w-3xl">
              <Skeleton className="h-7 md:h-8 w-full rounded-lg" />
            </div>

            {/* Hero Text Skeleton - Multiple lines */}
            <div className="space-y-3 max-w-4xl">
              <Skeleton className="h-6 w-full rounded" />
              <Skeleton className="h-6 w-full rounded" />
              <Skeleton className="h-6 w-11/12 rounded" />
            </div>
          </div>
        </div>

        {/* Scroll Indicator Skeleton */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="w-6 h-10 border-2 border-muted/50 rounded-full flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-muted/70 rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* Company Story Section Skeleton */}
      <section className="py-20 md:py-32 relative overflow-hidden">
        {/* Background Pattern Skeleton */}
        <div className="absolute inset-0 bg-grid-pattern opacity-30">
          <div className="w-full h-full bg-muted/20" />
        </div>

        <div className="container mx-auto px-4 relative">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Image Skeleton */}
            <div className="relative group">
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
                <Skeleton className="w-full h-full" />
                {/* Image Overlay Placeholder */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
              </div>

              {/* Floating Card Skeleton */}
              <div className="absolute -bottom-6 -right-6 bg-background border border-primary/20 rounded-xl shadow-2xl p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full gradient-primary animate-pulse" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-16 rounded" />
                    <Skeleton className="h-4 w-24 rounded" />
                  </div>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -z-10 -top-6 -left-6 w-full h-full border-2 border-primary/20 rounded-2xl" />
            </div>

            {/* Right Content Skeleton */}
            <div className="space-y-6">
              <div className="space-y-3">
                <Skeleton className="h-5 w-24 rounded" />
                <Skeleton className="h-12 w-48 sm:w-56 md:w-64 text-3xl md:text-5xl rounded" />
              </div>

              {/* Content Paragraphs Skeleton */}
              <div className="space-y-4">
                <Skeleton className="h-6 w-full rounded" />
                <Skeleton className="h-6 w-full rounded" />
                <Skeleton className="h-6 w-3/4 rounded" />
                <Skeleton className="h-6 w-4/5 rounded" />
                <Skeleton className="h-6 w-2/3 rounded" />
              </div>

              {/* CTA Button Skeleton */}
              <Skeleton className="h-12 w-40 md:w-48 rounded-lg" />
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission Section Skeleton */}
      <section className="py-20 md:py-32 bg-muted/30">
        <div className="container mx-auto px-4">
          {/* Section Header Skeleton */}
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-6">
            <Skeleton className="h-5 w-32 mx-auto rounded" />
            <Skeleton className="h-12 w-48 sm:w-56 md:w-64 mx-auto text-4xl md:text-5xl rounded" />
            <Skeleton className="h-6 w-80 md:w-96 mx-auto rounded" />
          </div>

          {/* Vision & Mission Cards Skeleton */}
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Vision Card Skeleton */}
            <div className="group relative overflow-hidden border-2 border-border rounded-2xl shadow-lg">
              {/* Top Gradient Line Placeholder */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent to-transparent" />

              <div className="p-8 md:p-10 space-y-6">
                {/* Icon */}
                <div className="relative inline-block">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 animate-pulse" />
                </div>

                {/* Title */}
                <Skeleton className="h-12 w-32 text-3xl rounded" />

                {/* Content */}
                <div className="space-y-3">
                  <Skeleton className="h-6 w-full rounded" />
                  <Skeleton className="h-6 w-5/6 rounded" />
                  <Skeleton className="h-6 w-4/5 rounded" />
                </div>

                {/* Decorative Element */}
                <div className="absolute -bottom-12 -right-12 w-32 h-32 rounded-full bg-primary/5" />
              </div>
            </div>

            {/* Mission Card Skeleton */}
            <div className="group relative overflow-hidden border-2 border-border rounded-2xl shadow-lg">
              {/* Top Gradient Line Placeholder */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-transparent to-transparent" />

              <div className="p-8 md:p-10 space-y-6">
                {/* Icon */}
                <div className="relative inline-block">
                  <div className="w-16 h-16 rounded-2xl bg-accent/10 animate-pulse" />
                </div>

                {/* Title */}
                <Skeleton className="h-12 w-32 text-3xl rounded" />

                {/* Content */}
                <div className="space-y-3">
                  <Skeleton className="h-6 w-full rounded" />
                  <Skeleton className="h-6 w-5/6 rounded" />
                  <Skeleton className="h-6 w-4/5 rounded" />
                </div>

                {/* Decorative Element */}
                <div className="absolute -bottom-12 -right-12 w-32 h-32 rounded-full bg-accent/5" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
