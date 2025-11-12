"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Shield,
  Award,
  Clock,
  HeadphonesIcon,
} from "lucide-react";
import { Typography } from "@/components/typography";

gsap.registerPlugin(ScrollTrigger);

const AnimatedTrustSection = () => {
  const trustRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animated trust badges
      gsap.fromTo(
        ".trust-badge",
        {
          scale: 0.8,
          opacity: 0,
          y: 30,
        },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: trustRef.current,
            start: "top 85%",
            once: true,
          },
        }
      );

      // Animated statistics
      gsap.fromTo(
        ".trust-stat",
        {
          opacity: 0,
          x: -20,
        },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          stagger: 0.05,
          ease: "power2.out",
          scrollTrigger: {
            trigger: trustRef.current,
            start: "top 80%",
            once: true,
          },
        }
      );
    }, trustRef);

    return () => ctx.revert();
  }, []);

  const trustItems = [
    { icon: Award, text: "10+ Years Experience" },
    { icon: Shield, text: "Certified Technicians" },
    { icon: Clock, text: "On-time Delivery" },
    { icon: HeadphonesIcon, text: "24/7 Support" },
  ];

  const trustStats = [
    { value: "500+", label: "Happy Clients" },
    { value: "1000+", label: "Projects Completed" },
    { value: "10+", label: "Years Experience" },
    { value: "24/7", label: "Customer Support" },
  ];

  return (
    <section ref={trustRef} className="py-20 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20 mb-6">
            <Shield className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-primary">Why Trust Us</span>
          </div>
          <Typography variant="Bold_H2" className="mb-4">
            Quality You Can Count On
          </Typography>
          <Typography variant="Regular_H6" className="text-muted-foreground max-w-2xl mx-auto">
            With years of experience and a team of certified professionals, we deliver
            exceptional glass solutions that exceed expectations.
          </Typography>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 mb-16">
          {trustItems.map((item, index) => (
            <div
              key={index}
              className="trust-badge flex items-center gap-3 px-6 py-3 bg-card rounded-full border border-border shadow-sm"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                <item.icon className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm font-medium text-foreground">{item.text}</span>
            </div>
          ))}
        </div>

        {/* Trust Statistics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {trustStats.map((stat, index) => (
            <div
              key={index}
              className="trust-stat text-center p-6 bg-card rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <Typography variant="Bold_H3" className="text-primary mb-2">
                {stat.value}
              </Typography>
              <Typography variant="Regular_H6" className="text-muted-foreground">
                {stat.label}
              </Typography>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export function TrustSection() {
  return <AnimatedTrustSection />;
}
