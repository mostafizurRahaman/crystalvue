// components/home/services-section.tsx
"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ServiceCategoryCard } from "@/components/cards";
import { Typography } from "@/components/typography";
import { useCategories } from "@/hooks";
import { useRouter } from "next/navigation";

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(useGSAP);

export function ServicesSection() {
  const container = useRef<HTMLDivElement>(null);

  // Get non-repairing categories
  const { data: regularResponse = [], isLoading: isLoadingRegular } =
    useCategories({
      page: 1,
      limit: 4,
      sortBy: "sortOrder",
      sortOrder: "asc",
      isActive: true,
      isRepairingService: false,
    });

  const router = useRouter();

  // Get repairing categories
  const { data: repairingResponse = [], isLoading: isLoadingRepairing } =
    useCategories({
      page: 1,
      limit: 4,
      sortBy: "sortOrder",
      sortOrder: "asc",
      isActive: true,
      isRepairingService: true,
    });

  const regularCategories = Array.isArray(regularResponse)
    ? regularResponse
    : regularResponse.data || [];
  const repairingCategories = Array.isArray(repairingResponse)
    ? repairingResponse
    : repairingResponse.data || [];

  useGSAP(
    () => {
      const cards = gsap.utils.toArray(".service-card");

      gsap.fromTo(
        cards,
        {
          opacity: 0,
          y: 80,
          scale: 0.9,
          filter: "blur(10px)",
          transformOrigin: "center center",
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          duration: 1,
          stagger: {
            amount: 0.5,
            from: "edges",
            grid: [3, 3], // Adjust based on your grid
            ease: "power3.inOut",
          },
          ease: "expo.out",
          scrollTrigger: {
            trigger: ".services-wrapper",
            start: "top 85%",
            once: false,
            markers: false,
          },
        }
      );
    },
    { scope: ".services-wrapper" }
  );

  return (
    <section className="py-20 services-wrapper">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Typography variant="Bold_H2" as="h2" className="mb-4">
            Our Services
          </Typography>
          <Typography
            variant="Regular_H4"
            className="text-muted-foreground max-w-2xl mx-auto"
          >
            Professional glass solutions tailored to your needs
          </Typography>
        </div>

        {/* First Row - Non-Repairing Services */}
        <div className="mb-16">
          <div
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
            ref={container}
          >
            {isLoadingRegular ? (
              // Loading skeleton for regular services
              Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="h-96 bg-muted/20 animate-pulse rounded-lg service-card"
                />
              ))
            ) : regularCategories.length > 0 ? (
              regularCategories.map((category) => (
                <ServiceCategoryCard
                  key={category.id}
                  category={category}
                  onExplore={() => {
                    router.push(`/all-categories/${category.id}`);
                  }}
                />
              ))
            ) : !isLoadingRepairing &&
              !isLoadingRegular &&
              regularCategories.length === 0 &&
              repairingCategories.length === 0 ? (
              <div className="col-span-full text-center py-16">
                <Typography
                  variant="Regular_H5"
                  className="text-muted-foreground"
                >
                  No services available at the moment.
                </Typography>
              </div>
            ) : null}
          </div>
        </div>

        {/* Second Row - Repairing Services */}
        <div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {isLoadingRepairing
              ? // Loading skeleton for repairing services
                Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-96 bg-muted/20 animate-pulse rounded-lg service-card"
                  />
                ))
              : repairingCategories.length > 0
                ? repairingCategories.map((category) => (
                    <ServiceCategoryCard
                      key={category.id}
                      category={category}
                    />
                  ))
                : !isLoadingRepairing &&
                    !isLoadingRegular &&
                    regularCategories.length === 0 &&
                    repairingCategories.length === 0
                  ? null
                  : null}
          </div>
        </div>
      </div>
    </section>
  );
}
