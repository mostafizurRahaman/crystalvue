// components/home/home-hero.tsx
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Menu, X, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { usePathname, useRouter } from "next/navigation";
import { Typography } from "@/components/typography";
import PrimaryButton from "@/components/buttons/primary-button";
import SecondaryButton from "@/components/buttons/secondary-button";
import HeroSliderSkeleton from "@/components/sekeletons/hero-slider";
import { useSliders } from "@/hooks";
import { Slider } from "@/api";
import IcoLogo from "@/assets/icons/ico-logo";

// Header Component
const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about-us" },
    { name: "Services", path: "/all-categories" },
    { name: "Gallery", path: "/gallery" },
    { name: "Contact", path: "/contact-us" },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-card">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="">
              <IcoLogo className="h-[70px]" />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`relative text-sm font-medium transition-colors hover:text-primary ${
                  isActive(link.path) ? "text-primary" : "text-foreground/80"
                }`}
              >
                {link.name}
                {isActive(link.path) && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-accent" />
                )}
              </Link>
            ))}
          </div>

          {/* CTA and Theme Toggle */}
          <div className="hidden md:flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-full"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
            <Link href="/contact-us">
              <Button className="gradient-primary text-white border-0 hover:opacity-90 transition-opacity">
                Get Free Quote
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-4 animate-slide-up">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                onClick={() => setIsOpen(false)}
                className={`block py-2 text-sm font-medium transition-colors ${
                  isActive(link.path) ? "text-primary" : "text-foreground/80"
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="flex items-center space-x-4 pt-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="rounded-full"
              >
                {theme === "dark" ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>
              <Link href="/contact-us" className="flex-1">
                <Button className="w-full gradient-primary text-white border-0">
                  Get Free Quote
                </Button>
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export interface HeroSliderProps {
  slides?: Slider[];
  autoPlayInterval?: number;
}

// HeroSlider Component
const HeroSlider = ({
  slides = [],
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

  // Use API slides if available, otherwise fallback to default slides
  const activeSlides = apiSlides.length > 0 ? apiSlides : slides;

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
              src={slide.image?.url || ""}
              alt={slide.title}
              fill
              className="object-cover"
              priority={index === 0}
              sizes="100vw"
            />
          </div>
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
                  btnText={slide.buttonText || "Get Started"}
                  icon={<ArrowRight />}
                  onClick={() =>
                    router.push(slide.buttonUrl || "/all-categories")
                  }
                />

                <SecondaryButton
                  btnText="Learn More"
                  onClick={() => router.push("/contact-us")}
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

// Main HomeHero Component
export function HomeHero() {
  return (
    <>
      <Header />
      <HeroSlider />
    </>
  );
}
