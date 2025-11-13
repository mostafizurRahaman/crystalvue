// components/home/testimonial/testimonial-section.tsx
"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import { Typography } from "@/components/typography";
import { CustomerReviewCard } from "@/components/cards";
import { Quote, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useTestimonials } from "@/hooks";
import type { Testimonial as ApiTestimonial } from "@/api";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

gsap.registerPlugin(ScrollTrigger);

interface TestimonialsSectionProps {
  title?: string;
  subtitle?: string;
  badge?: string;
  useApi?: boolean;
}

export function TestimonialsSection({
  title = "What Our Clients Say",
  subtitle = "Trusted by thousands of satisfied customers worldwide",
  badge = "Testimonials",
}: TestimonialsSectionProps) {
  // Fetch testimonials from API if useApi is true
  const { data, isLoading, error } = useTestimonials({
    page: 1,
    limit: 10,
    isActive: true,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const swiperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Badge animation
      gsap.fromTo(
        badgeRef.current,
        {
          scale: 0.8,
          opacity: 0,
        },
        {
          scale: 1,
          opacity: 1,
          duration: 0.6,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            once: true,
          },
        }
      );

      // Title animation
      gsap.fromTo(
        titleRef.current,
        {
          y: 50,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          delay: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            once: true,
          },
        }
      );

      // Subtitle animation
      gsap.fromTo(
        subtitleRef.current,
        {
          y: 30,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          delay: 0.4,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            once: true,
          },
        }
      );

      // Swiper container animation
      gsap.fromTo(
        swiperRef.current,
        {
          y: 60,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          delay: 0.6,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            once: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-20 md:py-32 overflow-hidden"
    >
      {/* Background decorative elements */}
      <div className="absolute top-1/4 left-0 w-96 h-96 opacity-20 pointer-events-none">
        <div className="w-full h-full gradient-primary rounded-full blur-3xl animate-float" />
      </div>
      <div className="absolute bottom-1/4 right-0 w-96 h-96 opacity-20 pointer-events-none">
        <div
          className="w-full h-full gradient-primary rounded-full blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        />
      </div>

      {/* Decorative grid pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />

      <div className="container mx-auto px-4 relative">
        {/* Header */}
        <div className="text-center mb-16 md:mb-20 space-y-6">
          {/* Badge */}
          <div ref={badgeRef} className="flex justify-center">
            <Badge className="gradient-primary text-primary-foreground px-4 py-2 text-sm">
              <Sparkles className="w-4 h-4 mr-2" />
              {badge}
            </Badge>
          </div>

          {/* Title */}
          <div
            ref={titleRef}
            className="flex items-center justify-center gap-4 flex-wrap"
          >
            <Quote className="w-10 h-10 md:w-12 md:h-12 text-primary" />
            <Typography
              variant="Bold_H1"
              className="bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent"
            >
              {title}
            </Typography>
          </div>

          {/* Subtitle */}
          <div ref={subtitleRef}>
            <Typography
              variant="Regular_H4"
              className="text-muted-foreground max-w-3xl mx-auto"
            >
              {subtitle}
            </Typography>
          </div>
        </div>

        {/* Testimonials Slider */}
        <div ref={swiperRef} className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="flex justify-center items-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <Typography
                variant="Regular_H5"
                className="text-muted-foreground"
              >
                Unable to load testimonials at this time. Please try again
                later.
              </Typography>
            </div>
          ) : data?.length === 0 ? (
            <div className="text-center py-16">
              <Typography
                variant="Regular_H5"
                className="text-muted-foreground"
              >
                No testimonials available yet.
              </Typography>
            </div>
          ) : (
            <Swiper
              modules={[Pagination, Autoplay]}
              spaceBetween={30}
              slidesPerView={1}
              pagination={{
                clickable: true,
                dynamicBullets: true,
                dynamicMainBullets: 3,
              }}
              autoplay={{
                pauseOnMouseEnter: true,
              }}
              speed={800}
              breakpoints={{
                640: {
                  slidesPerView: 1,
                  spaceBetween: 20,
                },
                768: {
                  slidesPerView: 2,
                  spaceBetween: 24,
                },
                1024: {
                  slidesPerView: 3,
                  spaceBetween: 30,
                },
              }}
              className="testimonials-swiper !pb-16"
            >
              {data?.map((testimonial) => (
                <SwiperSlide key={testimonial?.id} className="!h-auto flex">
                  <CustomerReviewCard testimonial={testimonial} />
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </div>
    </section>
  );
}
