// components/home/cta-section.tsx
"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ContactInfoCard } from "@/components/cards";
import { Phone, MessageSquare, Mail, ArrowRight, Sparkles } from "lucide-react";
import { useSettings } from "@/hooks";

gsap.registerPlugin(ScrollTrigger);

export function CTASection() {
  const footerRef = useRef<HTMLElement>(null);
  const { data: settings, isLoading } = useSettings();

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Cards entrance animation
      gsap.fromTo(
        ".contact-card",
        {
          y: 50,
          opacity: 0,
          rotateY: -30,
          transformPerspective: 1000,
        },
        {
          y: 0,
          opacity: 1,
          rotateY: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".cards-container",
            start: "top 85%",
            once: true,
          },
        }
      );

      // Pulse animation for CTA
      gsap.to(".pulse-ring", {
        scale: 1.5,
        opacity: 0,
        duration: 2,
        repeat: -1,
        ease: "power2.out",
      });
    }, footerRef);

    return () => ctx.revert();
  }, []);

  const contactCards = [
    {
      icon: Mail,
      title: "Email Us",
      content: settings?.contactEmail || "",
      action: settings?.contactEmail ? `mailto:${settings.contactEmail}` : "",
      color: "from-secondary/20 to-secondary/5",
    },
    {
      icon: MessageSquare,
      title: "WhatsApp",
      content: settings?.contactWhatsApp || "",
      action: settings?.contactWhatsApp
        ? `https://wa.me/${settings.contactWhatsApp.replace(/\D/g, "")}`
        : "",
      color: "from-accent/20 to-accent/5",
    },

    {
      icon: Phone,
      title: "Call Us",
      content: settings?.contactPhone || "",
      action: settings?.contactPhone
        ? `tel:${settings.contactPhone.replace(/\s/g, "")}`
        : "",
      color: "from-primary/20 to-primary/5",
    },
  ];

  // Skeleton loading state
  if (isLoading) {
    return (
      <footer className="relative bg-background overflow-hidden">
        <div className="relative pt-32 pb-16 gradient-hero">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              {/* Badge skeleton */}
              <div className="mb-4 h-8 w-40 mx-auto bg-background/20 rounded-full animate-pulse" />

              {/* Title skeleton */}
              <div className="mb-4 h-12 w-96 mx-auto bg-background/20 rounded-lg animate-pulse" />

              {/* Description skeleton */}
              <div className="mb-8">
                <div className="h-6 w-2/3 mx-auto bg-background/20 rounded-lg animate-pulse mb-2" />
                <div className="h-6 w-1/2 mx-auto bg-background/20 rounded-lg animate-pulse" />
              </div>

              {/* Button skeleton */}
              <div className="h-14 w-48 mx-auto bg-background/20 rounded-lg animate-pulse" />
            </div>

            {/* Contact cards skeleton */}
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-card/80 backdrop-blur-sm border border-border/20 rounded-lg p-6"
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-10 h-10 bg-primary/20 rounded-lg animate-pulse" />
                    <div>
                      <div className="h-5 w-20 bg-background/20 rounded-md animate-pulse mb-1" />
                      <div className="h-4 w-32 bg-background/20 rounded-md animate-pulse" />
                    </div>
                  </div>
                  <div className="h-10 w-full bg-background/20 rounded-md animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer ref={footerRef} className="relative bg-background overflow-hidden">
      {/* CTA Section with Gradient */}
      <div className="relative pt-32 pb-16 gradient-hero">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-background/10 backdrop-blur-sm border-background/20 text-primary-foreground">
              <Sparkles className="w-3 h-3 mr-1" />
              Get Started Today
            </Badge>
            <Typography
              variant="Bold_H2"
              className="mb-4 text-primary-foreground"
            >
              Ready to Transform Your Space?
            </Typography>
            <Typography
              variant="Regular_H5"
              className="text-primary-foreground/90 max-w-2xl mx-auto mb-8"
            >
              {settings?.siteDescription || ""}
            </Typography>

            {/* CTA Button with Pulse Effect */}
            <div className="relative inline-block">
              <div className="pulse-ring absolute inset-0 rounded-full bg-background/20" />
              <Link href="/contact-us">
                <Button
                  size="lg"
                  className="relative bg-background text-foreground hover:bg-background/90 shadow-2xl"
                >
                  <Typography variant="SemiBold_H5">Get Free Quote</Typography>
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Contact Cards */}
          <div className="cards-container grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {contactCards.map((card, index) => (
              <ContactInfoCard
                key={index}
                icon={card.icon}
                title={card.title}
                content={card.content}
                action={card.action}
                color={card.color}
                onClick={() => window.open(card.action, "_blank")}
              />
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
