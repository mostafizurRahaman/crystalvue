// components/cards/trust/trust-card.tsx
"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

export interface AchievementCardProps {
  icon: LucideIcon;
  value: string;
  label: string;
  delay?: string;
  className?: string;
}

export function AchievementCard({
  icon: Icon,
  value,
  label,
  delay = "0ms",
  className,
}: AchievementCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={cardRef}
      className={cn(
        "text-center group animate-in fade-in slide-in-from-bottom-4 duration-500",
        className
      )}
      style={{ animationDelay: delay }}
    >
      {/* Animated Icon Container */}
      <div className="relative inline-flex items-center justify-center mb-4">
        {/* Pulse Ring */}
        <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />

        {/* Icon Background */}
        <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
          <Icon className="w-8 h-8 text-white" />
        </div>
      </div>

      {/* Content */}
      <div className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-1">
        {value}
      </div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
}
