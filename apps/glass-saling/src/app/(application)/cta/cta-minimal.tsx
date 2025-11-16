// components/sections/CTAMinimal.tsx
"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/typography";
import Link from "next/link";
import { ArrowUpRight, ChevronRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export function CTAMinimal() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Reveal animation with split text effect
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
      });

      // Animate line
      tl.fromTo(
        ".divider-line",
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1,
          ease: "power2.inOut",
        }
      )
        // Animate content
        .fromTo(
          ".cta-content",
          {
            opacity: 0,
            x: -50,
          },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.2,
          },
          "-=0.5"
        );

      // Hover effect for entire section
      const hoverTl = gsap.timeline({ paused: true });
      hoverTl.to(".hover-bg", {
        scaleX: 1,
        duration: 0.5,
        ease: "power2.inOut",
      });

      sectionRef.current?.addEventListener("mouseenter", () => hoverTl.play());
      sectionRef.current?.addEventListener("mouseleave", () =>
        hoverTl.reverse()
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-20 lg:py-24 overflow-hidden cursor-pointer group bg-background"
    >
      {/* Hover Background using muted color */}
      <div
        className="hover-bg absolute inset-0 bg-muted origin-left"
        style={{ transform: "scaleX(0)" }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Left Content */}
          <div className="cta-content flex-1">
            <Typography variant="Bold_H2" className="mb-2 text-foreground">
              Let&apos;s work together
            </Typography>
            <Typography variant="Regular_H5" className="text-muted-foreground">
              Transform your vision into reality with our expertise
            </Typography>
          </div>

          {/* Divider using primary color */}
          <div className="divider-line hidden lg:block w-px h-20 bg-primary origin-top opacity-50" />

          {/* Right Content - Buttons */}
          <div className="cta-content flex items-center gap-4">
            <Link href="/contact-us">
              <Button
                size="lg"
                className="group/btn gradient-primary text-primary-foreground hover:opacity-90 transition-all"
              >
                <Typography variant="SemiBold_H5">
                  Get Free Measurements
                </Typography>
                <ArrowUpRight className="w-5 h-5 ml-2 transition-transform group-hover/btn:rotate-45" />
              </Button>
            </Link>

            <Link href="/contact-us">
              <Button
                size="lg"
                variant="ghost"
                className="group/btn hover:bg-accent hover:text-accent-foreground"
              >
                <Typography variant="Medium_H5">See our services</Typography>
                <ChevronRight className="w-5 h-5 ml-1 transition-transform group-hover/btn:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
