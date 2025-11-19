/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  ArrowRight,
  Sparkles,
  Star,
  Check,
  Zap,
  Shield,
  Gem,
  Award,
  TrendingUp,
} from "lucide-react";
import { Typography } from "@/components/typography";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Category } from "@/api";

export interface ServiceCategoryCardProps {
  category: Category;
  onExplore?: () => void;
  isNew?: boolean;
}

// Icon mapping for different addon types
const getAddonIcon = (addon: string, index: number) => {
  const icons = [Zap, Shield, Gem, Award, TrendingUp];
  const Icon = icons[index % icons.length];
  return <Icon className="w-3 h-3" />;
};

// Gradient styles for addon badges
const addonGradients = [
  "bg-gradient-to-r from-blue-500/20 to-purple-500/20 hover:from-blue-500/30 hover:to-purple-500/30 border-blue-500/30",
  "bg-gradient-to-r from-emerald-500/20 to-teal-500/20 hover:from-emerald-500/30 hover:to-teal-500/30 border-emerald-500/30",
  "bg-gradient-to-r from-orange-500/20 to-pink-500/20 hover:from-orange-500/30 hover:to-pink-500/30 border-orange-500/30",
  "bg-gradient-to-r from-violet-500/20 to-indigo-500/20 hover:from-violet-500/30 hover:to-indigo-500/30 border-violet-500/30",
];

export function ServiceCategoryCard({
  category,
  onExplore,
  isNew = false,
}: ServiceCategoryCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Entrance animation with float effect
      gsap.fromTo(
        cardRef.current,
        {
          y: 40,
          opacity: 0,
          scale: 0.95,
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: cardRef.current,
            start: "top 85%",
            once: true,
          },
        }
      );

      // Floating animation for decorative elements
      gsap.to(".float-element", {
        y: -5,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      });

      // Animate addon badges on hover
      gsap.utils.toArray(".addon-badge").forEach((badge: any) => {
        gsap.set(badge, { transformOrigin: "center" });
        badge.addEventListener("mouseenter", () => {
          gsap.to(badge, { scale: 1.05, duration: 0.2 });
        });
        badge.addEventListener("mouseleave", () => {
          gsap.to(badge, { scale: 1, duration: 0.2 });
        });
      });
    }, cardRef);

    return () => ctx.revert();
  }, []);

  return (
    <Card
      ref={cardRef}
      className={cn(
        "group relative overflow-hidden service-card",
        "glass-card",
        "border border-glass-border",
        "hover:shadow-xl transition-all duration-500",
        "bg-gradient-to-br from-card/95 via-card/90 to-muted/20 !pt-0 !pb-2"
      )}
    >
      {/* Animated gradient orb - smaller */}
      <div className="absolute -top-16 -right-16 w-32 h-32 rounded-full animate-float opacity-30">
        <div className="w-full h-full gradient-primary blur-2xl" />
      </div>

      {/* New Badge with animation */}
      {isNew && (
        <Badge className="absolute top-2 right-2 z-10 gradient-primary text-primary-foreground text-xs shadow-lg animate-pulse">
          <Sparkles className="w-2.5 h-2.5 mr-1" />
          NEW
        </Badge>
      )}

      {/* Cover Image Section - reduced height */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-b from-muted/50 to-background">
        <Image
          src={category.cardImage?.url as string}
          alt={category.cardImage?.altText || category.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />

        {/* Floating Icon with glass effect - smaller */}
        <div className="float-element absolute bottom-3 left-3">
          <div className="glass-button rounded-xl p-2.5 backdrop-blur-xl">
            <span className="text-4xl filter drop-shadow-lg">
              {category.isRepairingService ? "🛠️" : "🏢️"}
            </span>
          </div>
        </div>

        {/* Stats Badge with glass effect - smaller */}
        <div className="absolute bottom-3 right-3 glass-button rounded-full px-3 py-1.5 flex items-center gap-1.5">
          <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
          <Typography variant="Medium_H7" className="text-foreground">
            {category._count?.services || 0} Services
          </Typography>
        </div>
      </div>

      {/* Content Section - reduced padding */}
      <div className="p-4 space-y-4">
        {/* Title and Description */}
        <div className="space-y-2">
          <Typography
            variant="Bold_H3"
            className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent"
          >
            {category.name}
          </Typography>
          <Typography
            variant="Regular_H6"
            className="text-muted-foreground"
            maxLines={2}
          >
            {category.description || category.tagline}
          </Typography>
        </div>

        <Separator className="opacity-30" />

        {/* Enhanced Modern Add-ons Section with Gradient Chips */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <Typography
              variant="Medium_H7"
              className="text-muted-foreground uppercase tracking-wider"
            >
              Premium Features
            </Typography>
          </div>

          <div className="flex flex-wrap gap-2">
            {category.categoryAddons?.slice(0, 3).map((addon, index) => (
              <div
                key={index}
                className={cn(
                  "addon-badge",
                  "group/badge relative inline-flex items-center gap-1.5",
                  "px-3 py-1.5 rounded-full",
                  "border backdrop-blur-sm",
                  "transition-all duration-300 cursor-default",
                  "hover:shadow-md",
                  addonGradients[index % addonGradients.length]
                )}
              >
                {/* Icon with gradient */}
                <span className="text-primary/70 group-hover/badge:text-primary transition-colors">
                  {getAddonIcon(addon.addonText, index)}
                </span>

                {/* Text */}
                <span className="text-xs font-medium text-foreground/80 group-hover/badge:text-foreground transition-colors">
                  {addon.addonText}
                </span>

                {/* Shimmer effect on hover */}
                <div className="absolute inset-0 rounded-full opacity-0 group-hover/badge:opacity-100 transition-opacity duration-500">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
                </div>
              </div>
            ))}

            {(category.categoryAddons?.length || 0) > 3 && (
              <div className="inline-flex flex-wrap items-center gap-1 px-2.5 py-1.5 rounded-full bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 hover:border-primary/30 transition-all duration-300">
                <Check className="w-3 h-3 text-primary" />
                <span className="text-xs font-medium text-primary">
                  +{(category.categoryAddons?.length || 0) - 3} more
                </span>
              </div>
            )}
          </div>
        </div>

        {/* CTA Button with gradient - smaller */}
        <Button
          onClick={() => onExplore?.()}
          className="w-full gradient-primary  hover:opacity-90 text-primary-foreground shadow-lg group/btn cursor-pointer"
          size="default"
        >
          <Typography variant="Medium_H6" className="flex-1">
            Explore Services
          </Typography>
          <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
        </Button>
      </div>

      {/* Decorative corner accents - smaller */}
      <div className="absolute top-0 left-0 w-16 h-16">
        <div className="w-full h-full border-l border-t border-primary/20 rounded-tl-xl" />
      </div>
      <div className="absolute bottom-0 right-0 w-16 h-16">
        <div className="w-full h-full border-r border-b border-primary/20 rounded-br-xl" />
      </div>
    </Card>
  );
}
