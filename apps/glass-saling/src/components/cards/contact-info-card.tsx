// components/cards/contact/contact-card.tsx
"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { Card } from "@/components/ui/card";
import { Typography } from "@/components/typography";
import { cn } from "@/lib/utils";

export interface ContactInfoCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  content: string;
  action: string;
  color?: string;
  onClick?: () => void;
  className?: string;
}

export function ContactInfoCard({
  icon: Icon,
  title,
  content,
  action,
  color = "from-primary/20 to-primary/5",
  onClick,
  className,
}: ContactInfoCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <Card
      ref={cardRef}
      className={cn(
        "contact-card group cursor-pointer",
        "bg-background backdrop-blur-sm",
        "border-background/20 hover:border-background/40",
        "transition-all duration-300 hover:shadow-xl",
        color,
        className
      )}
      onClick={onClick}
    >
      <div className="p-6 text-center">
        <div className="inline-flex p-3 rounded-full bg-primary/50 mb-3 group-hover:scale-110 transition-transform">
          <Icon className="w-6 h-6 text-foreground" />
        </div>
        <Typography variant="SemiBold_H5" className="mb-1 text-foreground">
          {title}
        </Typography>
        <Typography variant="Regular_H6" className="text-foreground/80">
          {content}
        </Typography>
      </div>
    </Card>
  );
}
