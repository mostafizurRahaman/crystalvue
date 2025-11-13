// components/home/testimonial/testimonial-card.tsx
"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Card } from "@/components/ui/card";
import { Typography } from "@/components/typography";
import { Quote, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Testimonial } from "@/api";

interface TestimonialCardProps {
  name: string;
  role: string;
  company: string;
  content: string;
  avatar: Testimonial["image"];
  rating: number;
}

export function TestimonialCard({
  name,
  role,
  company,
  content,
  avatar,
  rating,
}: TestimonialCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Floating quote icon animation
      gsap.to(quoteRef.current, {
        y: -10,
        rotation: 5,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      });
    }, cardRef);

    return () => ctx.revert();
  }, []);

  return (
    <Card
      ref={cardRef}
      className={cn(
        "relative overflow-hidden",
        "glass-card",
        "border border-border",
        "p-8 md:p-8",
        "hover:shadow-2xl transition-all duration-500",
        "bg-card/95 h-full"
      )}
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Decorative floating quote icon */}
      <div
        ref={quoteRef}
        className="absolute -top-6 -right-6 opacity-10 pointer-events-none"
      >
        <Quote className="w-40 h-40 text-primary" strokeWidth={1.5} />
      </div>

      {/* Animated gradient orb */}
      <div className="absolute -top-20 -left-20 w-40 h-40 rounded-full opacity-20 pointer-events-none">
        <div className="w-full h-full gradient-primary blur-3xl animate-float" />
      </div>

      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 gradient-primary opacity-60" />

      <div
        className="relative"
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        {/* Quote Icon */}
        <div
          className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 border border-primary/20"
          style={{ marginBottom: "1.5rem" }}
        >
          <Quote className="w-6 h-6 text-primary" />
        </div>

        {/* Rating Stars */}
        <div className="flex gap-1" style={{ marginBottom: "1.5rem" }}>
          {Array.from({ length: Number(rating) || 5 }).map((_, index) => (
            <Star
              key={index}
              className={cn(
                "w-5 h-5 transition-all duration-300",
                index < rating
                  ? "text-primary fill-primary"
                  : "text-muted-foreground/30"
              )}
            />
          ))}
        </div>

        {/* Testimonial Content - flex-grow to fill available space */}
        <div
          style={{
            flexGrow: 1,
          }}
        >
          <Typography
            variant="Regular_H5"
            className="text-foreground/90 pb-5 line-clamp-3 "
            maxLines={6} // Add line clamping for consistent height
          >
            {content}
          </Typography>
        </div>

        {/* Author Info - stays at bottom */}
        <div style={{ marginTop: "auto" }}>
          <div className="flex items-center  pt-5 gap-4 border-t border-border/50">
            <div className="relative">
              <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-primary/30 ring-offset-2 ring-offset-background">
                <Image
                  src={avatar?.url as string}
                  alt={name}
                  width={32}
                  height={32}
                  className="object-cover size-8"
                />
              </div>
              {/* Online indicator */}
              <div className="absolute bottom-0 right-0 w-4 h-4 bg-primary rounded-full border-2 border-background" />
            </div>

            <div className="flex-1">
              <Typography variant="SemiBold_H6" className="text-foreground">
                {name}
              </Typography>
              <Typography
                variant="Regular_H7"
                className="text-muted-foreground truncate w-full block"
              >
                {role} • {company}
              </Typography>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom corner accent */}
      <div className="absolute bottom-0 right-0 w-20 h-20">
        <div className="w-full h-full border-r border-b border-primary/20 rounded-br-xl" />
      </div>
    </Card>
  );
}
