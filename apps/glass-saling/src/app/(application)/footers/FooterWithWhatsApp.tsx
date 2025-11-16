/* eslint-disable @typescript-eslint/no-explicit-any */
// components/layout/Footer.tsx
"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";

import { Typography } from "@/components/typography";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  ArrowUpRight,
  ChevronRight,
  MessageCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import IcoLogo from "@/assets/icons/ico-logo";
import { useSettings } from "../../../hooks/useSettings";
import { useCategories } from "@/hooks";
import { FooterSkeleton } from "@/components/sekeletons/footer-sekeleton";

gsap.registerPlugin(ScrollTrigger);

const FooterWhatsApp = () => {
  const footerRef = useRef<HTMLElement>(null);
  const { data: settings, isLoading } = useSettings();

  // Fetch 6 active categories for footer
  const { data: categoriesResponse } = useCategories({
    page: 1,
    limit: 6,
    sortBy: "sortOrder",
    sortOrder: "asc",
    isActive: true,
  });

  // Default values as fallback
  const siteTitle = settings?.siteTitle || "";
  const siteDescription = settings?.siteDescription || "";
  const contactAddress = settings?.officeAddress || "";
  const contactPhone = settings?.contactPhone || "";
  const contactEmail = settings?.contactEmail || "";
  const contactWhatsApp = settings?.contactWhatsApp || "";
  const businessHours =
    settings?.businessHours?.openingText && settings?.businessHours?.closeText
      ? `${settings.businessHours.openingText}\n${settings.businessHours.closeText}`
      : "";
  const logoImage = settings?.logoImage;
  const socialMediaLinks = settings?.socialMediaLinks;

  useEffect(() => {
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
      links.forEach((link: any) => {
        link.addEventListener("mouseenter", () => {
          gsap.to(link, { x: 5, duration: 0.3, ease: "power2.out" });
        });
        link.addEventListener("mouseleave", () => {
          gsap.to(link, { x: 0, duration: 0.3, ease: "power2.out" });
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
          duration: 0.6,
          delay: 1,
          ease: "back.out(1.7)",
        }
      );
    }, footerRef);

    return () => ctx.revert();
  }, []);

  const currentYear = new Date().getFullYear();
  const whatsappNumber = contactWhatsApp.replace(/[^\d+]/g, "");
  const whatsappMessage = "Hello! I'm interested in your services.";

  const quickLinks = [
    { href: "/about-us", label: "About Us" },
    { href: "/all-categories", label: "Services" },
    { href: "/gallery", label: "Gallery" },

    { href: "/contact-us", label: "Contact" },
  ];

  // Extract categories from API response
  const categories = Array.isArray(categoriesResponse)
    ? categoriesResponse
    : categoriesResponse?.data || [];

  const socialLinks = [
    {
      Icon: Facebook,
      href: socialMediaLinks?.facebook || "",
      label: "Facebook",
    },
    {
      Icon: Instagram,
      href: socialMediaLinks?.instagram || "#",
      label: "Instagram",
    },
    { Icon: Twitter, href: socialMediaLinks?.twitter || "#", label: "Twitter" },
    {
      Icon: Linkedin,
      href: socialMediaLinks?.linkedin || "#",
      label: "LinkedIn",
    },
    // { Icon: Youtube, href: "#", label: "YouTube" },
  ];

  const handleWhatsAppClick = () => {
    const url = `https://wa.me/${whatsappNumber.replace(
      /\+/g,
      ""
    )}?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(url, "_blank");
  };

  // Skeleton loading state
  if (isLoading) {
    return <FooterSkeleton />;
  }

  return (
    <footer
      ref={footerRef}
      className="relative bg-card border-t border-border overflow-hidden"
    >
      {/* Decorative gradient orb */}
      <div className="float-decoration absolute -top-20 -right-20 w-40 h-40 bg-primary/5 rounded-full blur-3xl" />

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-4">
          {/* Company Info - Spans 2 columns on lg */}
          <div className="footer-section lg:col-span-2 space-y-4">
            <IcoLogo className=" h-20" />

            {/* Tagline */}
            <Typography
              variant="Regular_H6"
              className="text-muted-foreground leading-relaxed max-w-md"
            >
              {siteDescription}
            </Typography>

            {/* Social Icons */}
            <div className="social-icons-container">
              <Typography variant="Medium_H6" className="mb-3">
                Follow Us
              </Typography>
              <div className="flex gap-2">
                {socialLinks.map(({ Icon, href, label }, index) => (
                  <Link
                    key={index}
                    href={href}
                    aria-label={label}
                    className="social-icon"
                  >
                    <div className="w-10 h-10 rounded-lg bg-muted hover:bg-primary/10 border border-border hover:border-primary/50 flex items-center justify-center transition-all duration-300 group">
                      <Icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <Typography
              variant="SemiBold_H5"
              className="mb-4 flex items-center gap-2"
            >
              <ChevronRight className="w-4 h-4 text-primary" />
              Quick Links
            </Typography>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="footer-link inline-flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Typography variant="Regular_H6">{link.label}</Typography>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="footer-section">
            <Typography
              variant="SemiBold_H5"
              className="mb-4 flex items-center gap-2"
            >
              <ChevronRight className="w-4 h-4 text-primary" />
              Our Services
            </Typography>
            <ul className="space-y-2">
              {categories.map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/all-categories/${category.id}`}
                    className="footer-link inline-flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Typography variant="Regular_H6">
                      {category.name}
                    </Typography>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer-section">
            <Typography
              variant="SemiBold_H5"
              className="mb-4 flex items-center gap-2"
            >
              <ChevronRight className="w-4 h-4 text-primary" />
              Contact Us
            </Typography>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 group cursor-pointer">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary" />
                <Typography
                  variant="Regular_H6"
                  className="text-muted-foreground group-hover:text-foreground transition-colors whitespace-pre-line"
                  onClick={() =>
                    window.open(`https://maps.app.goo.gl/1234567890`, "_blank")
                  }
                >
                  {contactAddress}
                </Typography>
              </li>
              <li className="flex items-start gap-2 group cursor-pointer">
                <Mail className="w-4 h-4 mt-0.5  text-primary" />
                <Typography
                  variant="Regular_H6"
                  className="text-muted-foreground group-hover:text-foreground transition-colors"
                  onClick={() =>
                    window.open(`mailto:${contactEmail}`, "_blank")
                  }
                >
                  {contactEmail}
                </Typography>
              </li>
              <li className="flex items-start gap-2 group cursor-pointer">
                <MessageCircle className="w-4 h-4 mt-0.5  text-primary" />
                <Typography
                  variant="Regular_H6"
                  className="text-muted-foreground group-hover:text-foreground transition-colors"
                  onClick={handleWhatsAppClick}
                >
                  {contactWhatsApp} (WhatsApp)
                </Typography>
              </li>
              <li className="flex items-start gap-2 group cursor-pointer">
                <Phone className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary" />
                <Typography
                  variant="Regular_H6"
                  className="text-muted-foreground group-hover:text-foreground transition-colors"
                  onClick={() => window.open(`tel:${contactPhone}`, "_blank")}
                >
                  {contactPhone}
                </Typography>
              </li>

              <li className="flex items-start gap-2">
                <Clock className="w-4 h-4 mt-0.5  text-primary" />
                <Typography
                  variant="Regular_H6"
                  className="text-muted-foreground whitespace-pre-line"
                >
                  {businessHours}
                </Typography>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <Separator className="my-8 opacity-50" />

        <div className="footer-section flex flex-col md:flex-row items-center justify-between gap-4">
          <Typography
            variant="Regular_H6"
            className="text-muted-foreground text-center md:text-left"
          >
            © {currentYear} {siteTitle}. All rights reserved.
          </Typography>

          <div className="flex flex-wrap items-center gap-4 text-center">
            <Link href="/privacy">
              <Typography
                variant="Regular_H6"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Privacy Policy
              </Typography>
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link href="/terms">
              <Typography
                variant="Regular_H6"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Terms of Service
              </Typography>
            </Link>
          </div>
        </div>
      </div>

      {/* Floating WhatsApp Button */}
      <button
        onClick={handleWhatsAppClick}
        className="whatsapp-float fixed bottom-24 left-8 w-14 h-14 rounded-full bg-green-600 hover:bg-green-700 text-background shadow-2xl flex cursor-pointer items-center justify-center hover:scale-110 transition-all duration-300 z-50 group"
        aria-label="Chat on WhatsApp"
      >
        {/* Pulse ring effect */}
        <div className="whatsapp-pulse absolute inset-0 rounded-full bg-green-600" />

        <MessageCircle className="w-7 h-7 relative z-10 group-hover:scale-110 transition-transform" />

        {/* Tooltip */}
        <div className="absolute left-full mr-3 px-3 py-2 bg-primary text-primary-foreground border border-border rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          <Typography variant="Regular_H7">Chat with us on WhatsApp</Typography>
        </div>
      </button>

      {/* Back to top button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-8 right-8 w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:scale-110 transition-all duration-300 z-50 group"
        aria-label="Back to top"
      >
        <ArrowUpRight className="w-5 h-5" />

        {/* Tooltip */}
        <div className="absolute right-full mr-3 px-3 py-2 bg-primary text-primary-foreground border border-border rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          <Typography variant="Regular_H7">Back to top</Typography>
        </div>
      </button>
    </footer>
  );
};

export default FooterWhatsApp;
