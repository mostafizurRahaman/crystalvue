// app/about/page.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/typography";
import { ArrowRight, Sparkles, Target, Eye } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

import { getAboutPageData, type AboutPageData } from "@/api";
import { AboutPageSkeleton } from "@/components/about-page-skeleton";
import { TestimonialsSection, TrustSection, CTASection } from "@/components/home";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function AboutPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const storyRef = useRef<HTMLDivElement>(null);
  const visionMissionRef = useRef<HTMLDivElement>(null);
  const [aboutData, setAboutData] = useState<AboutPageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await getAboutPageData();
        console.log("About page API response:", response); // Debug log
        console.log("About data:", response.data); // Debug log

        if (response.success) {
          // Ensure the data structure includes visionBlock and missionBlock
          const aboutPageData = response.data;
          console.log("Vision Block in response:", aboutPageData.visionBlock);
          console.log("Mission Block in response:", aboutPageData.missionBlock);

          setAboutData(aboutPageData);
        } else {
          setError(response.message || "Failed to load about page data");
        }
      } catch (err) {
        console.error("Error fetching about data:", err);
        setError("Failed to load about page data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAboutData();
  }, []);

  // Fallback data for UI consistency while loading or error
  const fallbackData: AboutPageData = {
    id: 1,
    introTitle: "Crafting Excellence in Glass Solutions",
    introSubtitle:
      "Transforming spaces with premium glass installations since 2008",
    heroText:
      "We are passionate craftsmen dedicated to bringing your vision to life through innovative glass solutions. Our commitment to quality and customer satisfaction has made us the trusted choice for residential and commercial projects across Doha.",
    companyStory: {
      id: "1",
      title: "Our Journey",
      content:
        "Founded with a vision to transform spaces with premium glass and aluminium solutions.",
      isActive: true,
      createdAt: "",
      updatedAt: "",
    },
    visionBlock: {
      id: "1",
      type: "VISION",
      title: "Our Vision",
      content:
        "To be the leading provider of innovative glass and aluminium solutions, transforming spaces with exceptional craftsmanship.",
      isActive: true,
      createdAt: "",
      updatedAt: "",
    },
    missionBlock: {
      id: "2",
      type: "MISSION",
      title: "Our Mission",
      content:
        "To deliver superior quality glass and aluminium installations that exceed client expectations through innovation, craftsmanship, and exceptional service.",
      isActive: true,
      createdAt: "",
      updatedAt: "",
    },
    isActive: true,
    createdAt: "",
    updatedAt: "",
  };

  const dataToUse = aboutData || fallbackData;

  useEffect(() => {
    if (!isLoading && !error) {
      const ctx = gsap.context(() => {
        // Hero animation
        gsap.from(heroRef.current, {
          opacity: 0,
          y: 50,
          duration: 1,
          ease: "power3.out",
        });

        // Story section animation
        gsap.from(storyRef.current, {
          opacity: 0,
          y: 100,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: storyRef.current,
            start: "top 80%",
            once: true,
          },
        });

        // Vision & Mission animation
        gsap.from(visionMissionRef.current?.children || [], {
          opacity: 0,
          y: 80,
          stagger: 0.2,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: visionMissionRef.current,
            start: "top 80%",
            once: true,
          },
        });
      });

      return () => ctx.revert();
    }
  }, [isLoading, error]);

  // Loading state
  if (isLoading) {
    return <AboutPageSkeleton />;
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Typography variant="Bold_H3" className="text-destructive">
            Error Loading Content
          </Typography>
          <Typography variant="Regular_H5" className="text-muted-foreground">
            {error}
          </Typography>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  // Debug console logs
  console.log("Vision Block:", dataToUse.visionBlock);
  console.log("Mission Block:", dataToUse.missionBlock);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Banner */}
      <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src={dataToUse.bannerImage?.url || "/images/about-banner.jpg"}
            alt={dataToUse.bannerImage?.altText || "About Glass Sailing"}
            fill
            className="object-cover"
            priority
            onError={(e) => {
              e.currentTarget.src = "/images/about-banner.jpg";
            }}
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 gradient-hero" />
          <div className="absolute inset-0 bg-background/20" />
        </div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float" />
          <div
            className="absolute bottom-20 left-20 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float"
            style={{ animationDelay: "2s" }}
          />
        </div>

        {/* Hero Content */}
        <div
          ref={heroRef}
          className="relative h-full container mx-auto px-4 flex items-center"
        >
          <div className="max-w-4xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 glass-card px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-primary" />
              <Typography variant="Medium_H6" className="text-foreground">
                About Us
              </Typography>
            </div>

            {/* Title */}
            <Typography
              variant="Bold_H1"
              className="text-5xl md:text-6xl lg:text-7xl text-white mb-6 leading-tight"
            >
              {dataToUse.introTitle}
            </Typography>

            {/* Subtitle */}
            <Typography
              variant="Regular_H4"
              className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl"
            >
              {dataToUse.introSubtitle}
            </Typography>

            {/* Hero Text */}
            <Typography
              variant="Regular_H5"
              className="text-lg text-white/80 max-w-3xl leading-relaxed"
            >
              {dataToUse.heroText}
            </Typography>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-white/70 rounded-full" />
          </div>
        </div>
      </section>

      {/* Company Story Section */}
      <section
        ref={storyRef}
        className="py-20 md:py-32 relative overflow-hidden"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />

        <div className="container mx-auto px-4 relative">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Image */}
            <div className="relative group">
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
                <Image
                  src={
                    dataToUse.companyStory?.leftImage?.url ||
                    "/images/company-story.jpg"
                  }
                  alt={
                    dataToUse.companyStory?.leftImage?.altText ||
                    "Our craftsmen at work"
                  }
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  onError={(e) => {
                    e.currentTarget.src = "/images/company-story.jpg";
                  }}
                />
                {/* Image Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
              </div>

              {/* Floating Card */}
              <div className="absolute -bottom-6 -right-6 glass-card p-6 rounded-xl shadow-2xl border border-primary/20">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <Typography variant="Bold_H4" className="text-foreground">
                      15+ Years
                    </Typography>
                    <Typography
                      variant="Regular_H6"
                      className="text-muted-foreground"
                    >
                      of Excellence
                    </Typography>
                  </div>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -z-10 -top-6 -left-6 w-full h-full border-2 border-primary/20 rounded-2xl" />
            </div>

            {/* Right Content */}
            <div className="space-y-6">
              <div>
                <Typography variant="Medium_H5" className="text-primary mb-3">
                  Our Story
                </Typography>
                <Typography
                  variant="Bold_H2"
                  className="text-foreground mb-6 text-4xl md:text-5xl"
                >
                  {dataToUse.companyStory?.title || "Our Journey"}
                </Typography>
              </div>

              <div className="space-y-4">
                {(dataToUse.companyStory?.content || "")
                  .split("\n\n")
                  .map((paragraph, index) => (
                    <Typography
                      key={index}
                      variant="Regular_H5"
                      className="text-muted-foreground leading-relaxed text-lg"
                    >
                      {paragraph}
                    </Typography>
                  ))}
              </div>

              {/* CTA Button */}
              <Button
                size="lg"
                className="group mt-8 bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Typography variant="Medium_H5">
                  Explore Our Services
                </Typography>
                <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission Section */}
      <section className="py-20 md:py-32 bg-muted/30">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Typography variant="Medium_H5" className="text-primary mb-3">
              Our Purpose
            </Typography>
            <Typography
              variant="Bold_H2"
              className="text-foreground mb-6 text-4xl md:text-5xl"
            >
              Vision & Mission
            </Typography>
            <Typography
              variant="Regular_H5"
              className="text-muted-foreground text-lg"
            >
              Guided by our core values and commitment to excellence
            </Typography>
          </div>

          {/* Vision & Mission Cards */}
          <div
            ref={visionMissionRef}
            className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto"
          >
            {/* Vision Card */}
            <Card
              className={cn(
                "group relative overflow-hidden",
                "border-2 border-border hover:border-primary/50",
                "transition-all duration-500",
                "hover:shadow-2xl hover:-translate-y-2"
              )}
            >
              {/* Top Gradient Line */}
              <div className="absolute top-0 left-0 right-0 h-1 gradient-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <CardContent className="p-8 md:p-10 space-y-6">
                {/* Icon */}
                <div className="relative inline-block">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-500">
                    <Eye className="w-8 h-8 text-primary" />
                  </div>
                  {/* Glow Effect */}
                  <div className="absolute inset-0 rounded-2xl bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                {/* Title */}
                <Typography
                  variant="Bold_H3"
                  className="text-foreground text-3xl"
                >
                  {dataToUse.visionBlock?.title || "Our Vision"}
                </Typography>

                {/* Content */}
                <Typography
                  variant="Regular_H5"
                  className="text-muted-foreground leading-relaxed text-lg"
                >
                  {dataToUse.visionBlock?.content ||
                    "Creating a future where technology enhances human potential and innovation drives positive change."}
                </Typography>

                {/* Decorative Element */}
                <div className="absolute -bottom-12 -right-12 w-32 h-32 rounded-full bg-primary/5 group-hover:bg-primary/10 transition-colors duration-500" />
              </CardContent>
            </Card>

            {/* Mission Card */}
            <Card
              className={cn(
                "group relative overflow-hidden",
                "border-2 border-border hover:border-accent/50",
                "transition-all duration-500",
                "hover:shadow-2xl hover:-translate-y-2"
              )}
            >
              {/* Top Gradient Line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <CardContent className="p-8 md:p-10 space-y-6">
                {/* Icon */}
                <div className="relative inline-block">
                  <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors duration-500">
                    <Target className="w-8 h-8 text-accent" />
                  </div>
                  {/* Glow Effect */}
                  <div className="absolute inset-0 rounded-2xl bg-accent/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                {/* Title */}
                <Typography
                  variant="Bold_H3"
                  className="text-foreground text-3xl"
                >
                  {dataToUse.missionBlock?.title || "Our Mission"}
                </Typography>

                {/* Content */}
                <Typography
                  variant="Regular_H5"
                  className="text-muted-foreground leading-relaxed text-lg"
                >
                  {dataToUse.missionBlock?.content ||
                    "We are committed to delivering cutting-edge solutions that democratize access to advanced technologies and drive sustainable growth through collaborative innovation and ethical practices."}
                </Typography>

                {/* Decorative Element */}
                <div className="absolute -bottom-12 -right-12 w-32 h-32 rounded-full bg-accent/5 group-hover:bg-accent/10 transition-colors duration-500" />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      {/* Trusted Section */}
      <TrustSection />

      {/* CTA Section */}
      <CTASection />

      {/* Testimonials Section */}
      <TestimonialsSection
        title="What Our Clients Say"
        subtitle="Join thousands of satisfied customers who have transformed their business with our solutions"
        badge="Testimonials"
      />
    </div>
  );
}
