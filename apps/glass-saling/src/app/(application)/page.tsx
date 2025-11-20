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
      <h1 className="hidden">
        Glass Expert Qatar | Professional Glass Services
      </h1>
      <h2 className="hidden">Glass Expert Qatar Hero Section</h2>
      {/* Hero Section with Slider */}
      <HomeHero />

      {/* Trusted Section */}
      <h2 className="hidden">Why Customers Trust Glass Expert Qatar</h2>
      <TrustSection />

      {/* Services Section */}
      <h2 className="hidden">Featured Glass Installation Services</h2>
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
      <h2 className="hidden">Schedule Your Glass Consultation</h2>
      <CTASection />

      {/* Testimonials Section */}
      <h2 className="hidden">Glass Expert Qatar Testimonials</h2>
      <TestimonialsSection
        title="What Our Clients Say"
        subtitle="Join thousands of satisfied customers who have transformed their business with our solutions"
        badge="Testimonials"
      />

      {/* Map Section */}
      <h2 className="hidden">Glass Expert Qatar Location Map</h2>
      <MapSection />

      <div className="hidden" aria-hidden="true">
        <nav>
          <ul>
            <li>
              <Link href="/about-us">
                Learn more about Glass Expert Qatar services
              </Link>
            </li>
            <li>
              <Link href="/all-categories">
                Explore every glass installation category
              </Link>
            </li>
            <li>
              <Link href="/gallery">
                View modern Doha glass project gallery
              </Link>
            </li>
            <li>
              <Link href="/contact-us">
                Contact Glass Expert Qatar support team
              </Link>
            </li>
            <li>
              <Link href="/privacy-policy">
                Review the Glass Expert Qatar privacy policy
              </Link>
            </li>
            <li>
              <Link href="/terms-and-conditions">
                Read Glass Expert Qatar terms and conditions
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Index;
