"use client";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";

import { HomeHero, MapSection } from "@/components/home";

const TrustSection = dynamic(
  () => import("@/components/home").then((mod) => mod.TrustSection),
  {
    ssr: false,
  }
);

const ServicesSection = dynamic(
  () => import("@/components/home").then((mod) => mod.ServicesSection),
  {
    ssr: false,
  }
);

const TestimonialsSection = dynamic(
  () => import("@/components/home").then((mod) => mod.TestimonialsSection),
  {
    ssr: false,
  }
);

const CTASection = dynamic(
  () => import("@/components/home").then((mod) => mod.CTASection),
  {
    ssr: false,
  }
);

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section with Slider */}
      <HomeHero />

      {/* Trusted Section */}
      <TrustSection />

      {/* Services Section */}
      <ServicesSection />

      <div className="text-center mt-12 mb-12">
        <Link href="/all-categories">
          <Button
            size="lg"
            className="gradient-primary cursor-pointer text-white border-0"
          >
            View All Services <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
        <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm">
          <Link href="/gallery" className="text-primary hover:underline">
            View Gallery
          </Link>
          <span className="text-muted-foreground">•</span>
          <Link href="/about-us" className="text-primary hover:underline">
            About Us
          </Link>
          <span className="text-muted-foreground">•</span>
          <Link href="/contact-us" className="text-primary hover:underline">
            Contact Us
          </Link>
        </div>
      </div>

      {/* CTA Section */}
      <CTASection />

      {/* Testimonials Section */}
      <TestimonialsSection
        title="What Our Clients Say"
        subtitle="Join thousands of satisfied customers who have transformed their business with our solutions"
        badge="Testimonials"
      />

      {/* Map Section */}
      <MapSection />
    </div>
  );
};

export default Index;
