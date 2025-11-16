// components/sections/CTAGlassCard.tsx
"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Typography } from "@/components/typography";
import Link from "next/link";
import { ArrowRight, Sparkles, Gift, Clock, Shield, Award } from "lucide-react";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

export function CTAGlassCard() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 3D tilt effect on mouse move
      const card = cardRef.current;
      if (card) {
        const handleMouseMove = (e: MouseEvent) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;

          const rotateX = (y - centerY) / 20;
          const rotateY = (centerX - x) / 20;

          gsap.to(card, {
            rotationX: rotateX,
            rotationY: rotateY,
            transformPerspective: 1000,
            duration: 0.5,
            ease: "power2.out",
          });
        };

        const handleMouseLeave = () => {
          gsap.to(card, {
            rotationX: 0,
            rotationY: 0,
            duration: 0.5,
            ease: "power2.out",
          });
        };

        card.addEventListener("mousemove", handleMouseMove);
        card.addEventListener("mouseleave", handleMouseLeave);

        return () => {
          card.removeEventListener("mousemove", handleMouseMove);
          card.removeEventListener("mouseleave", handleMouseLeave);
        };
      }

      // Entrance animation
      gsap.fromTo(
        card,
        {
          opacity: 0,
          y: 100,
          scale: 0.8,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            once: true,
          },
        }
      );

      // Animate icons
      gsap.to(".benefit-icon", {
        y: -5,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
        stagger: 0.2,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-24 lg:py-32 overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />

      {/* Animated Orbs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float" />
      <div
        className="absolute bottom-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float"
        style={{ animationDelay: "2s" }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <Card
          ref={cardRef}
          className={cn(
            "max-w-5xl mx-auto",
            "glass-card backdrop-blur-xl",
            "border-2 border-primary/20",
            "shadow-2xl",
            "overflow-hidden",
            "transform-gpu"
          )}
        >
          {/* Special Offer Badge */}
          <div className="absolute top-0 right-0">
            <div className="bg-gradient-to-br from-yellow-400 to-orange-500 text-white px-6 py-2 rounded-bl-2xl shadow-lg">
              <div className="flex items-center gap-2">
                <Gift className="w-4 h-4" />
                <Typography variant="SemiBold_H7">Special Offer</Typography>
              </div>
            </div>
          </div>

          <div className="p-8 lg:p-12">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 mb-4">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                <Typography
                  variant="Medium_H6"
                  className="text-muted-foreground uppercase tracking-wider"
                >
                  Transform Your Space Today
                </Typography>
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              </div>

              <Typography
                variant="Bold_H1"
                className="mb-4 bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent"
              >
                Get Your Free Quote Now
              </Typography>

              <Typography
                variant="Regular_H4"
                className="text-muted-foreground max-w-2xl mx-auto"
              >
                Join 500+ satisfied customers who transformed their spaces with
                our premium solutions
              </Typography>
            </div>

            {/* Benefits Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
              {[
                {
                  icon: Clock,
                  label: "Quick Response",
                  desc: "Within 24 hours",
                },
                {
                  icon: Shield,
                  label: "Quality Assured",
                  desc: "Premium materials",
                },
                {
                  icon: Award,
                  label: "Best Prices",
                  desc: "Market competitive",
                },
                { icon: Sparkles, label: "Expert Team", desc: "10+ years exp" },
              ].map((benefit, index) => (
                <div
                  key={index}
                  className="text-center p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="benefit-icon inline-flex p-3 rounded-full bg-primary/10 mb-2">
                    <benefit.icon className="w-5 h-5 text-primary" />
                  </div>
                  <Typography variant="SemiBold_H6" className="mb-1">
                    {benefit.label}
                  </Typography>
                  <Typography
                    variant="Regular_H7"
                    className="text-muted-foreground"
                  >
                    {benefit.desc}
                  </Typography>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/contact-us">
                <Button
                  size="lg"
                  className="gradient-primary text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 min-w-[200px] group"
                >
                  <Typography variant="SemiBold_H5">Get Free Quote</Typography>
                  <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-2" />
                </Button>
              </Link>

              <Link href="/portfolio">
                <Button
                  size="lg"
                  variant="outline"
                  className="min-w-[200px] group hover:bg-primary hover:text-white transition-all duration-300"
                >
                  <Typography variant="SemiBold_H5">View Portfolio</Typography>
                  <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>

            {/* Urgency Message */}
            <div className="mt-8 text-center">
              <Badge className="bg-red-500/10 text-red-600 border-red-500/20">
                <Clock className="w-3 h-3 mr-1" />
                Limited slots available this month
              </Badge>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
