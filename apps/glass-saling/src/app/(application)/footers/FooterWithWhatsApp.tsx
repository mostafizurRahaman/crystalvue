"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { ClientOnly } from "@/components/client-only";
import { Typography } from "@/components/typography";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  Phone,
  Mail,
  Heart,
  ChevronRight,
  ArrowUp,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
} from "lucide-react";
import { useSettings } from "@/hooks";

gsap.registerPlugin(ScrollTrigger);

const FooterSkeleton = () => (
  <footer className="relative bg-background">
    <div className="pt-32 pb-16">
      <div className="container mx-auto px-4">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-48 mx-auto mb-4"></div>
          <div className="h-4 bg-muted rounded w-96 mx-auto"></div>
        </div>
      </div>
    </div>
  </footer>
);

const FooterWhatsApp = () => {
  return (
    <ClientOnly fallback={<FooterSkeleton />}>
      <FooterWhatsAppInner />
    </ClientOnly>
  );
};

const FooterWhatsAppInner = () => {
  const footerRef = useRef<HTMLElement>(null);
  const { data: settings, isLoading } = useSettings();

  // Default values as fallback
  const siteTitle = settings?.siteTitle || "";
  const siteDescription = settings?.siteDescription || "";
  const contactAddress = settings?.officeAddress || "";
  const contactPhone = settings?.contactPhone || "";
  const contactEmail = settings?.contactEmail || "";
  const contactWhatsApp = settings?.contactWhatsApp || "";

  useEffect(() => {
    if (!footerRef.current) return;

    const ctx = gsap.context(() => {
      // Animate footer sections on scroll
      gsap.fromTo(
        ".footer-section",
        {
          y: 30,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 90%",
            once: true,
          },
        }
      );

      // Animate social icons
      gsap.fromTo(
        ".social-icon",
        {
          scale: 0,
          rotation: -180,
        },
        {
          scale: 1,
          rotation: 0,
          duration: 0.5,
          stagger: 0.05,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: ".social-icons-container",
            start: "top 95%",
            once: true,
          },
        }
      );

      // Float animation for decorative element
      gsap.to(".float-decoration", {
        y: -10,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      });

      // Hover animations for links
      const links = gsap.utils.toArray(".footer-link");
      links.forEach((link) => {
        (link as Element).addEventListener("mouseenter", () => {
          gsap.to(link as Element, { x: 5, duration: 0.3, ease: "power2.out" });
        });
        (link as Element).addEventListener("mouseleave", () => {
          gsap.to(link as Element, { x: 0, duration: 0.3, ease: "power2.out" });
        });
      });

      // Pulse animation for WhatsApp button
      gsap.to(".whatsapp-pulse", {
        scale: 1.3,
        opacity: 0,
        duration: 2,
        repeat: -1,
        ease: "power2.out",
      });

      // WhatsApp button entrance animation
      gsap.fromTo(
        ".whatsapp-float",
        {
          scale: 0,
          rotation: -180,
          opacity: 0,
        },
        {
          scale: 1,
          rotation: 0,
          opacity: 1,
          duration: 0.8,
          delay: 0.5,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 80%",
            once: true,
          },
        }
      );
    }, footerRef);

    return () => ctx.revert();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const services = [
    "Glass Installation",
    "Window Repair",
    "Glass Replacement",
    "Custom Glass Solutions",
    "Emergency Glass Services",
    "Shower Enclosures",
    "Glass Doors & Partitions",
    "UPVC Solutions",
    "Window Repair",
    "Shower Enclosures",
    "Glass Doors & Partitions",
  ];

  const socialLinks = [
    { Icon: Facebook, href: "", label: "Facebook" },
    { Icon: Instagram, href: "#", label: "Instagram" },
    { Icon: Twitter, href: "#", label: "Twitter" },
    { Icon: Linkedin, href: "#", label: "LinkedIn" },
    // { Icon: Youtube, href: "#", label: "YouTube" },
  ];

  // Skeleton loading state
  if (isLoading) {
    return <FooterSkeleton />;
  }

  return (
    <footer ref={footerRef} className="relative bg-background overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 gradient-hero opacity-5" />

      {/* Decorative elements */}
      <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-primary/20 blur-3xl float-decoration" />
      <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-accent/20 blur-3xl float-decoration" />

      {/* CTA Section */}
      <div className="relative pt-32 pb-16 gradient-hero">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 footer-section">
            <Typography variant="Bold_H2" className="mb-4">
              Let&apos;s Work Together
            </Typography>
            <Typography
              variant="Regular_H4"
              className="text-muted-foreground max-w-2xl mx-auto"
            >
              Have a project in mind? We&apos;d love to hear about it.
            </Typography>
          </div>

          {/* Contact Information */}
          <div className="grid md:grid-cols-3 gap-8 mb-12 footer-section">
            <div className="text-center group">
              <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-full gradient-primary mb-4 group-hover:scale-110 transition-transform duration-300">
                <Phone className="w-8 h-8 text-white" />
                <div className="absolute inset-0 rounded-full gradient-primary animate-ping" />
              </div>
              <Typography variant="SemiBold_H3" className="text-foreground mb-2">
                Call Us
              </Typography>
              <Typography variant="Regular_H6" className="text-muted-foreground">
                {contactPhone || "Loading..."}
              </Typography>
            </div>

            <div className="text-center group">
              <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 mb-4 group-hover:scale-110 transition-transform duration-300">
                <Mail className="w-8 h-8 text-white" />
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 animate-ping" />
              </div>
              <Typography variant="SemiBold_H3" className="text-foreground mb-2">
                Email Us
              </Typography>
              <Typography variant="Regular_H6" className="text-muted-foreground">
                {contactEmail || "Loading..."}
              </Typography>
            </div>

            <div className="text-center group">
              <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-secondary to-secondary/60 mb-4 group-hover:scale-110 transition-transform duration-300">
                <MapPin className="w-8 h-8 text-white" />
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-secondary to-secondary/60 animate-ping" />
              </div>
              <Typography variant="SemiBold_H3" className="text-foreground mb-2">
                Visit Us
              </Typography>
              <Typography variant="Regular_H6" className="text-muted-foreground">
                {contactAddress || "Loading..."}
              </Typography>
            </div>
          </div>

          {/* WhatsApp Button */}
          <div className="text-center footer-section">
            <Link
              href={contactWhatsApp ? `https://wa.me/${contactWhatsApp.replace(/\D/g, "")}` : "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-full hover:shadow-xl hover:scale-105 transition-all duration-300 whatsapp-float group"
            >
              {/* Pulse effect */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 animate-ping whatsapp-pulse" />
              
              {/* Button content */}
              <span className="relative z-10">Contact on WhatsApp</span>
              <ArrowUp className="w-5 h-5 rotate-45 relative z-10 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="bg-card border-t">
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-4 footer-section">
              <div className="flex items-center gap-3 mb-6">
                <div className="relative w-12 h-12 rounded-lg gradient-primary flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <Typography variant="SemiBold_H3" className="text-foreground">
                    {siteTitle || "Glass Solutions"}
                  </Typography>
                </div>
              </div>

              <Typography
                variant="Regular_H6"
                className="text-muted-foreground mb-6"
              >
                {siteDescription ||
                  "Your trusted partner for professional glass solutions. Quality workmanship guaranteed."}
              </Typography>

              <div className="space-y-3">
                <Typography
                  variant="Regular_H6"
                  className="text-muted-foreground flex items-start gap-3"
                >
                  <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  {contactAddress || "Loading..."}
                </Typography>
                <Typography
                  variant="Regular_H6"
                  className="text-muted-foreground flex items-center gap-3"
                >
                  <Phone className="w-5 h-5 text-primary" />
                  {contactPhone || "Loading..."}
                </Typography>
                <Typography
                  variant="Regular_H6"
                  className="text-muted-foreground flex items-center gap-3"
                >
                  <Mail className="w-5 h-5 text-primary" />
                  {contactEmail || "Loading..."}
                </Typography>
              </div>
            </div>

            {/* Services */}
            <div className="lg:col-span-3 footer-section">
              <Typography
                variant="SemiBold_H4"
                className="text-foreground mb-6"
              >
                Our Services
              </Typography>
              <ul className="space-y-3">
                {services.slice(0, 6).map((service, index) => (
                  <li key={index}>
                    <Link
                      href="/services"
                      className="text-muted-foreground hover:text-primary transition-colors duration-200 inline-flex items-center gap-2 group footer-link"
                    >
                      <ChevronRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                      <Typography variant="Regular_H6">{service}</Typography>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick Links */}
            <div className="lg:col-span-2 footer-section">
              <Typography
                variant="SemiBold_H4"
                className="text-foreground mb-6"
              >
                Quick Links
              </Typography>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/"
                    className="text-muted-foreground hover:text-primary transition-colors duration-200 inline-flex items-center gap-2 group footer-link"
                  >
                    <ChevronRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                    <Typography variant="Regular_H6">Home</Typography>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about-us"
                    className="text-muted-foreground hover:text-primary transition-colors duration-200 inline-flex items-center gap-2 group footer-link"
                  >
                    <ChevronRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                    <Typography variant="Regular_H6">About Us</Typography>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/all-categories"
                    className="text-muted-foreground hover:text-primary transition-colors duration-200 inline-flex items-center gap-2 group footer-link"
                  >
                    <ChevronRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                    <Typography variant="Regular_H6">Services</Typography>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/gallery"
                    className="text-muted-foreground hover:text-primary transition-colors duration-200 inline-flex items-center gap-2 group footer-link"
                  >
                    <ChevronRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                    <Typography variant="Regular_H6">Gallery</Typography>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact-us"
                    className="text-muted-foreground hover:text-primary transition-colors duration-200 inline-flex items-center gap-2 group footer-link"
                  >
                    <ChevronRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                    <Typography variant="Regular_H6">Contact</Typography>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Social Media */}
            <div className="lg:col-span-3 footer-section">
              <Typography
                variant="SemiBold_H4"
                className="text-foreground mb-6"
              >
                Follow Us
              </Typography>
              <div className="flex flex-wrap gap-3 mb-6 social-icons-container">
                {socialLinks.map((social, index) => {
                  const Icon = social.Icon;
                  return (
                    <Link
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted/10 border border-border hover:bg-primary hover:text-white transition-all duration-300 group social-icon"
                      aria-label={social.label}
                    >
                      <Icon className="w-5 h-5" />
                    </Link>
                  );
                })}
              </div>

              <Typography
                variant="Regular_H6"
                className="text-muted-foreground mb-4"
              >
                Stay updated with our latest projects and offers.
              </Typography>
            </div>
          </div>

          <Separator className="my-12" />

          {/* Bottom Footer */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <Typography
              variant="Regular_H6"
              className="text-muted-foreground"
            >
              © 2024 {siteTitle || "Glass Solutions"}. All rights reserved.
            </Typography>

            <button
              onClick={scrollToTop}
              className="flex items-center gap-2 px-4 py-2 bg-muted/10 rounded-full border border-border hover:bg-primary hover:text-white transition-all duration-300 group"
            >
              <ArrowUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform duration-300" />
              <Typography variant="Regular_H6">Back to top</Typography>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterWhatsApp;
