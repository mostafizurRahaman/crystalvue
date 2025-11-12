"use client";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ClientOnly } from "@/components/client-only";

import {
  HomeHero,
  TrustSection,
  ServicesSection,
  TestimonialsSection,
  CTASection,
  MapSection,
} from "@/components/home";

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section with Slider */}
      <HomeHero />

      {/* Trusted Section */}
      <ClientOnly>
        <TrustSection />
      </ClientOnly>

      {/* Services Section */}
      <ClientOnly>
        <ServicesSection />
      </ClientOnly>

      <div className="text-center mt-12 mb-12">
        <Link href="/all-categories">
          <Button
            size="lg"
            className="gradient-primary cursor-pointer text-white border-0"
          >
            View All Services <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </div>

      {/* CTA Section */}
      <ClientOnly>
        <CTASection />
      </ClientOnly>

      {/* Testimonials Section */}
      <ClientOnly>
        <TestimonialsSection
          title="What Our Clients Say"
          subtitle="Join thousands of satisfied customers who have transformed their business with our solutions"
          badge="Testimonials"
        />
      </ClientOnly>

      {/* Map Section */}
      <MapSection />
    </div>
  );
};

export default Index;
