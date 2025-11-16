// components/sections/CTASection.tsx
"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/typography";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  Star,
  Phone,
  Mail,
  MessageSquare,
  ChevronRight,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

export function CTASection() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate background gradient
      gsap.to(".gradient-bg", {
        backgroundPosition: "200% center",
        duration: 20,
        repeat: -1,
        ease: "linear",
      });

      // Floating elements animation
      gsap.to(".float-element", {
        y: -20,
        rotation: 360,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
        stagger: {
          each: 0.2,
          from: "random",
        },
      });

      // Content entrance animation
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
      });

      tl.fromTo(
        ".cta-title",
        {
          y: 50,
          opacity: 0,
          scale: 0.9,
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: "power3.out",
        }
      )
        .fromTo(
          ".cta-subtitle",
          {
            y: 30,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: "power2.out",
          },
          "-=0.4"
        )
        .fromTo(
          ".cta-button",
          {
            scale: 0,
            opacity: 0,
          },
          {
            scale: 1,
            opacity: 1,
            duration: 0.5,
            ease: "back.out(1.7)",
            stagger: 0.1,
          },
          "-=0.2"
        )
        .fromTo(
          ".feature-badge",
          {
            x: -20,
            opacity: 0,
          },
          {
            x: 0,
            opacity: 1,
            duration: 0.4,
            stagger: 0.1,
            ease: "power2.out",
          },
          "-=0.3"
        );

      // Pulse animation for primary button
      gsap.to(".pulse-button", {
        scale: 1.05,
        duration: 1,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-24 lg:py-32"
    >
      {/* Animated Gradient Background */}
      <div
        className="gradient-bg absolute inset-0 opacity-90"
        style={{
          background: "var(--gradient-primary)",
          backgroundSize: "400% 400%",
        }}
      />

      {/* Mesh Pattern Overlay */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full">
          <pattern
            id="mesh"
            x="0"
            y="0"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="20" cy="20" r="1" fill="white" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#mesh)" />
        </svg>
      </div>

      {/* Floating Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="float-element absolute top-10 left-10 text-primary-foreground/20">
          <Sparkles className="w-12 h-12" />
        </div>
        <div className="float-element absolute top-20 right-20 text-primary-foreground/20">
          <Star className="w-8 h-8" />
        </div>
        <div className="float-element absolute bottom-10 left-1/4 text-primary-foreground/20">
          <Zap className="w-10 h-10" />
        </div>
        <div className="float-element absolute bottom-20 right-1/3 text-primary-foreground/20">
          <Star className="w-6 h-6" />
        </div>
      </div>

      {/* Main Content */}
      <div ref={contentRef} className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 backdrop-blur-sm border border-primary/20">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <Typography
                variant="Medium_H6"
                className="text-primary-foreground"
              >
                Limited Time Offer
              </Typography>
            </div>
          </div>

          {/* Title */}
          <Typography
            variant="Bold_H1"
            className="cta-title text-primary-foreground mb-6 drop-shadow-lg"
          >
            Ready to Transform Your Space?
          </Typography>

          {/* Subtitle */}
          <Typography
            variant="Regular_H4"
            className="cta-subtitle text-primary-foreground/90 mb-8 max-w-2xl mx-auto"
          >
            Get a free consultation and quote today. Our experts are ready to
            bring your vision to life.
          </Typography>

          {/* Feature Badges */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {[
              "Free Consultation",
              "24/7 Support",
              "Premium Quality",
              "Best Price Guarantee",
            ].map((feature, index) => (
              <div
                key={index}
                className="feature-badge inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 backdrop-blur-sm border border-primary/20"
              >
                <ChevronRight className="w-3 h-3 text-primary-foreground" />
                <Typography
                  variant="Regular_H7"
                  className="text-primary-foreground/90"
                >
                  {feature}
                </Typography>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/contact-us">
              <Button
                size="lg"
                className="cta-button pulse-button bg-white text-primary hover:bg-white/90 shadow-2xl min-w-[200px] group"
              >
                <Typography variant="SemiBold_H5">Get Free Quote</Typography>
                <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>

            <Link href="/contact-us">
              <Button
                size="lg"
                variant="outline"
                className="cta-button glass-button text-foreground border-foreground/30 hover:bg-background/10 min-w-[180px] group"
              >
                <Phone className="w-5 h-5 mr-2" />
                <Typography variant="SemiBold_H5">Call Us Now</Typography>
              </Button>
            </Link>

            <Link href="/chat">
              <Button
                size="lg"
                variant="outline"
                className="cta-button glass-button text-foreground border-foreground/30 hover:bg-background/10 min-w-[180px] group"
              >
                <MessageSquare className="w-5 h-5 mr-2" />
                <Typography variant="SemiBold_H5">Live Chat</Typography>
              </Button>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 pt-8 border-t border-primary/20">
            <div className="flex flex-wrap justify-center items-center gap-8">
              <div className="text-center">
                <Typography
                  variant="Bold_H3"
                  className="text-primary-foreground"
                >
                  500+
                </Typography>
                <Typography
                  variant="Regular_H7"
                  className="text-primary-foreground/80"
                >
                  Happy Clients
                </Typography>
              </div>
              <div className="text-center">
                <Typography
                  variant="Bold_H3"
                  className="text-primary-foreground"
                >
                  10+
                </Typography>
                <Typography
                  variant="Regular_H7"
                  className="text-primary-foreground/80"
                >
                  Years Experience
                </Typography>
              </div>
              <div className="text-center">
                <Typography
                  variant="Bold_H3"
                  className="text-primary-foreground"
                >
                  24/7
                </Typography>
                <Typography
                  variant="Regular_H7"
                  className="text-primary-foreground/80"
                >
                  Support Available
                </Typography>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" className="w-full h-20">
          <path
            d="M0,32L48,37.3C96,43,192,53,288,58.7C384,64,480,64,576,58.7C672,53,768,43,864,48C960,53,1056,75,1152,80C1248,85,1344,75,1392,69.3L1440,64L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
            className="fill-background"
          />
        </svg>
      </div>
    </section>
  );
}
