// components/cards/ChildServiceCard.tsx
"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowUpRight,
  Eye,
  Zap,
  Sparkles,
  Check,
  ShoppingCart,
  MessageCircle,
  CheckCircle,
  CheckCircle2Icon,
} from "lucide-react";
import { Typography } from "@/components/typography";
import Image from "next/image";
import { cn } from "@/lib/utils";
import img1 from "@/assets/istockphoto-2212194349-612x612.webp";

export interface ServiceAddon {
  id: string;
  addonText: string;
  sortOrder: number;
  isActive: boolean;
}

export interface ServiceItemCardProps {
  title: string;
  tagline: string;
  image: string;
  badge?: string;
  isPremium?: boolean;
  serviceAddons?: ServiceAddon[];
  onBuyNow?: () => void;
  onContactUs?: () => void;
}

export function ServiceItemCard({
  title,
  tagline,
  image,
  badge,
  isPremium = false,
  serviceAddons = [],
  onBuyNow,
  onContactUs,
}: ServiceItemCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  // Filter and sort active addons
  const activeAddons = serviceAddons
    .filter((addon) => addon.isActive)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Slide up animation
      gsap.fromTo(
        cardRef.current,
        {
          y: 40,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: cardRef.current,
            start: "top 90%",
            once: true,
          },
        }
      );

      // Image parallax effect on hover
      const imageHover = gsap.to(imageRef.current, {
        scale: 1.1,
        duration: 0.4,
        paused: true,
        ease: "power2.out",
      });

      cardRef.current?.addEventListener("mouseenter", () => imageHover.play());
      cardRef.current?.addEventListener("mouseleave", () =>
        imageHover.reverse()
      );

      return () => imageHover.kill();
    }, cardRef);

    return () => ctx.revert();
  }, []);

  return (
    <Card
      ref={cardRef}
      className={cn(
        "group relative overflow-hidden",
        "border border-border hover:border-primary/50",
        "hover:shadow-xl transition-all duration-500",
        "bg-card/95 hover:bg-card !pt-0 !pb-0",
        isPremium && "ring-2 ring-primary/20"
      )}
    >
      {/* Premium gradient line */}
      {isPremium && (
        <div className="absolute top-0 left-0 right-0 h-1">
          <div className="w-full h-full gradient-primary opacity-80" />
        </div>
      )}

      {/* Badge with glass effect */}
      {badge && (
        <Badge
          className={cn(
            "absolute top-4 right-4 z-20",
            "glass-button backdrop-blur-xl",
            "bg-primary/90 text-primary-foreground shadow-lg"
          )}
        >
          <Zap className="w-3 h-3 mr-1" />
          {badge}
        </Badge>
      )}

      {/* Image Section */}
      <div className="relative h-52 overflow-hidden bg-muted/30">
        <div ref={imageRef} className="w-full h-full">
          <Image
            src={img1 || image}
            alt={title}
            fill
            className="object-cover"
          />
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-40 group-hover:opacity-60 transition-opacity duration-500" />

        {/* View Icon - appears on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="glass-button rounded-full p-4 backdrop-blur-xl animate-slide-up">
            <Eye className="w-6 h-6 text-primary" />
          </div>
        </div>

        {/* Decorative sparkle for premium */}
        {isPremium && (
          <Sparkles className="absolute top-4 left-4 w-5 h-5 text-primary animate-pulse" />
        )}
      </div>

      {/* Content Section */}
      <div className="p-5 space-y-4">
        {/* Title with Premium badge */}
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <Typography
              variant="SemiBold_H4"
              className="text-foreground line-clamp-1 flex-1"
            >
              {title}
            </Typography>
          </div>

          <Typography
            variant="Regular_H6"
            className="text-muted-foreground"
            maxLines={2}
          >
            {tagline}
          </Typography>
        </div>

        {/* Add-ons Section */}
        {activeAddons.length > 0 && (
          <div className="space-y-2">
            <ul className="space-y-2">
              {activeAddons?.slice(0, 3).map((addon) => (
                <li
                  key={addon.id}
                  className="flex items-start gap-2 group/addon"
                >
                  <div className="shrink-0 mt-0.5">
                    <div className="w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center group-hover/addon:bg-primary/20 transition-colors">
                      <CheckCircle2Icon className="w-3 h-3 text-primary" />
                    </div>
                  </div>
                  <Typography
                    variant="Regular_H7"
                    className="text-muted-foreground text-xs flex-1 leading-relaxed line-clamp-1"
                  >
                    {addon.addonText}
                  </Typography>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* CTA Buttons */}
        <div className="flex gap-2">
          {/* Buy Now Button - Primary */}
          <Button
            onClick={onBuyNow}
            className={cn(
              "flex-1 group/btn",
              "bg-primary hover:bg-primary/90 text-primary-foreground",
              "transition-all duration-300",
              "cursor-pointer"
            )}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            <Typography variant="Medium_H6">Buy Now</Typography>
            <ArrowUpRight className="w-4 h-4 ml-2 transition-transform group-hover/btn:rotate-45" />
          </Button>

          {/* Contact Us Button - Secondary */}
          <Button
            onClick={onContactUs}
            variant="outline"
            className={cn(
              "flex-1 group/contact",
              "border-primary/50 hover:bg-primary/10",
              "transition-all duration-300",
              "cursor-pointer"
            )}
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            <Typography variant="Medium_H6">Contact</Typography>
          </Button>
        </div>
      </div>

      {/* Animated gradient orb */}
      <div className="absolute -bottom-8 -right-8 w-32 h-32 opacity-20 pointer-events-none">
        <div className="w-full h-full gradient-primary rounded-full blur-2xl animate-float" />
      </div>

      {/* Side accent with gradient */}
      <div className="absolute top-1/2 -translate-y-1/2 left-0 w-1 h-0 gradient-primary group-hover:h-24 transition-all duration-500 rounded-full" />
    </Card>
  );
}
