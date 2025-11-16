"use client";
import { useState, useEffect } from "react";
import Image, { StaticImageData } from "next/image";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

import PrimaryButton from "./buttons/primary-button";
import { Typography } from "./typography";
import SecondaryButton from "./buttons/secondary-button";
import HeroSliderSkeleton from "./sekeletons/hero-slider";
import { useSliders } from "@/hooks";
import { Slider, getImageUrl, getButtonUrl } from "@/api";

interface SlideContent {
  id: number | string;
  image: StaticImageData | string;
  title: string;
  subtitle: string;
  primaryButton: {
    text: string;
    link: string;
  };
  secondaryButton: {
    text: string;
    link: string;
  };
}

interface HeroSliderProps {
  slides?: SlideContent[];
  autoPlayInterval?: number;
}

const defaultSlides: SlideContent[] = [];

const HeroSlider = ({
  slides = defaultSlides,
  autoPlayInterval = 5000,
}: HeroSliderProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const {
    data: apiSlides = [],
    isLoading,
    error,
  } = useSliders({
    page: 1,
    limit: 10,
    sortBy: "orderNumber",
    sortOrder: "asc",
    active_only: true,
  });
  const router = useRouter();

  // Convert API sliders to SlideContent format
  const convertApiSlideToSlideContent = (slider: Slider): SlideContent => {
    return {
      id: slider.id,
      image: getImageUrl(slider.image),
      title: slider.title,
      subtitle: slider.subtitle || "",
      primaryButton: {
        text: slider.buttonText || "Get Started",
        link: getButtonUrl(slider),
      },
      secondaryButton: {
        text: "Get Our Services",
        link: "/all-categories",
      },
    };
  };

  // Use API slides if available, otherwise fallback to default slides
  const activeSlides =
    apiSlides.length > 0
      ? apiSlides.map(convertApiSlideToSlideContent)
      : slides;

  useEffect(() => {
    if (activeSlides.length > 0) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
      }, autoPlayInterval);
      return () => clearInterval(timer);
    }
  }, [activeSlides.length, autoPlayInterval]);

  // Show loading skeleton
  if (isLoading && apiSlides.length === 0) {
    return <HeroSliderSkeleton />;
  }

  // Show error fallback if API fails
  if (error && apiSlides.length === 0) {
    console.warn("Using default slides due to API error:", error);
  }

  return (
    <section className="relative h-[600px] overflow-hidden">
      {activeSlides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="relative w-full h-full">
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              className="object-cover"
              priority={index === 0}
              sizes="100vw"
            />
          </div>
          {/* <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30" /> */}
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/80  dark:from-background/70 to-foreground/30 dark:to-background/30" />
        </div>
      ))}

      <div className="relative h-full container mx-auto px-4 flex items-center">
        <div className="max-w-2xl animate-slide-up space-y-6">
          {activeSlides.map((slide, index) => (
            <div
              key={slide.id}
              className={`transition-opacity duration-500 ${
                index === currentSlide ? "opacity-100" : "opacity-0 absolute"
              }`}
            >
              <Typography
                variant="Bold_H1"
                className="text-4xl md:text-5xl !mb-6 block text-primary-foreground md:!leading-[1.3]"
              >
                {slide.title}
              </Typography>
              <Typography
                variant="Regular_H4"
                className="text-primary-foreground/90 mb-6"
              >
                {slide.subtitle}
              </Typography>

              <div className="flex flex-wrap gap-4">
                <PrimaryButton
                  btnText={slide.primaryButton.text}
                  icon={<ArrowRight />}
                  onClick={() => router.push(slide.primaryButton.link)}
                />

                <SecondaryButton
                  btnText={slide.secondaryButton.text}
                  onClick={() => router.push(slide.secondaryButton.link)}
                  variant="outline"
                  size="lg"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Slider Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {activeSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full cursor-pointer transition-all ${
              index === currentSlide
                ? "bg-primary-foreground w-8"
                : "bg-primary-foreground/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSlider;
