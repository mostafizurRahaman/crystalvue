const HeroSliderSkeleton = () => {
  return (
    <section className="relative h-[600px] overflow-hidden bg-muted">
      {/* Background shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-muted via-muted-foreground/5 to-muted">
        <div className="absolute inset-0 shimmer-effect" />
      </div>

      <div className="relative h-full container mx-auto px-4 flex items-center">
        <div className="max-w-2xl space-y-6 w-full">
          {/* Title skeleton - 2 lines */}
          <div className="space-y-3 animate-pulse">
            <div className="h-12 md:h-16 bg-muted-foreground/10 rounded-lg w-full relative overflow-hidden">
              <div className="absolute inset-0 shimmer-effect" />
            </div>
            <div className="h-12 md:h-16 bg-muted-foreground/10 rounded-lg w-4/5 relative overflow-hidden">
              <div className="absolute inset-0 shimmer-effect" />
            </div>
          </div>

          {/* Description skeleton - 2 lines */}
          <div className="space-y-2.5 animate-pulse">
            <div className="h-6 bg-muted-foreground/10 rounded-md w-full relative overflow-hidden">
              <div className="absolute inset-0 shimmer-effect" />
            </div>
            <div className="h-6 bg-muted-foreground/10 rounded-md w-11/12 relative overflow-hidden">
              <div className="absolute inset-0 shimmer-effect" />
            </div>
          </div>

          {/* Buttons skeleton */}
          <div className="flex flex-wrap gap-4 pt-2">
            <div className="h-12 bg-muted-foreground/10 rounded-lg w-52 relative overflow-hidden animate-pulse">
              <div className="absolute inset-0 shimmer-effect" />
            </div>
            <div className="h-12 bg-muted-foreground/10 rounded-lg w-44 relative overflow-hidden animate-pulse">
              <div className="absolute inset-0 shimmer-effect" />
            </div>
          </div>
        </div>
      </div>

      {/* Slider Indicators skeleton */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {[1, 2, 3].map((index) => (
          <div
            key={index}
            className={`h-3 rounded-full bg-muted-foreground/20 animate-pulse ${
              index === 0 ? "w-8" : "w-3"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSliderSkeleton;
