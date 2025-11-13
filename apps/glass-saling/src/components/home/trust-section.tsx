// components/home/trust-section.tsx
"use client";
import {
  Shield,
  Award,
  Clock,
  HeadphonesIcon,
  Trophy,
  BadgeCheck,
  Zap,
  CheckCircle,
  Users,
  Star,
} from "lucide-react";
import { AchievementCard } from "@/components/cards";

const TrustBadges = () => {
  const trustItems = [
    { icon: Award, text: "10+ Years Experience" },
    { icon: Shield, text: "Certified Technicians" },
    { icon: Clock, text: "On-time Delivery" },
    { icon: HeadphonesIcon, text: "24/7 Support" },
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-6 mt-8">
      {trustItems.map((item, index) => (
        <div
          key={index}
          className="flex items-center gap-2 text-sm text-muted-foreground"
        >
          <item.icon className="w-4 h-4 text-primary" />
          <span>{item.text}</span>
          {index < trustItems.length - 1 && (
            <span className="hidden md:inline ml-6 text-border">|</span>
          )}
        </div>
      ))}
    </div>
  );
};

const TrustSectionCards = () => {
  const trustBadges = [
    {
      icon: Award,
      title: "10+ Years",
      subtitle: "Industry Experience",
      color: "from-blue-500 to-indigo-600",
    },
    {
      icon: BadgeCheck,
      title: "Certified",
      subtitle: "Expert Technicians",
      color: "from-green-500 to-emerald-600",
    },
    {
      icon: Zap,
      title: "On-time",
      subtitle: "Fast Delivery",
      color: "from-orange-500 to-red-600",
    },
    {
      icon: HeadphonesIcon,
      title: "24/7",
      subtitle: "Customer Support",
      color: "from-purple-500 to-pink-600",
    },
  ];

  return (
    <section className="py-12 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {trustBadges.map((badge, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-xl bg-card p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-border/50 hover:border-primary/20"
            >
              {/* Gradient Background on Hover */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${badge.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
              />

              {/* Icon */}
              <div
                className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br ${badge.color} mb-4 group-hover:scale-110 transition-transform duration-300`}
              >
                <badge.icon className="w-6 h-6 text-white" />
              </div>

              {/* Content */}
              <h3 className="font-bold text-lg text-foreground mb-1">
                {badge.title}
              </h3>
              <p className="text-sm text-muted-foreground">{badge.subtitle}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const TrustBar = () => {
  const features = [
    { icon: CheckCircle, text: "10+ Years Experience" },
    { icon: Award, text: "Certified Technicians" },
    { icon: Users, text: "500+ Happy Clients" },
    { icon: Star, text: "24/7 Support" },
  ];

  return (
    <div className="mt-8 py-4 px-6 bg-muted/50 backdrop-blur-sm rounded-2xl border border-border/50">
      <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
        {features.map((feature, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
              <feature.icon className="w-4 h-4 text-primary" />
            </div>
            <span className="text-sm font-medium text-foreground/80">
              {feature.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const AnimatedTrustSection = () => {
  const trustIndicators = [
    {
      icon: Trophy,
      value: "10+",
      label: "Years Experience",
      delay: "0ms",
    },
    {
      icon: Shield,
      value: "100%",
      label: "Certified Team",
      delay: "100ms",
    },
    {
      icon: Clock,
      value: "98%",
      label: "On-time Delivery",
      delay: "200ms",
    },
    {
      icon: HeadphonesIcon,
      value: "24/7",
      label: "Support Available",
      delay: "300ms",
    },
  ];

  return (
    <section className="py-16 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />

      <div className="container mx-auto px-4 relative">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
            <CheckCircle className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              Trusted by Thousands
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Why Choose Us
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Experience excellence with our proven track record and commitment to
            quality
          </p>
        </div>

        {/* Trust Indicators */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {trustIndicators.map((item, index) => (
            <AchievementCard
              key={index}
              icon={item.icon}
              value={item.value}
              label={item.label}
              delay={item.delay}
            />
          ))}
        </div>

        {/* Bottom Trust Bar */}
        <div className="mt-12 flex items-center justify-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-card rounded-full border border-border shadow-lg">
            <Shield className="w-5 h-5 text-green-500" />
            <span className="text-sm font-medium">
              Trusted • Reliable • Professional • Available 24/7
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

const TrustRow = () => {
  const trustPoints = [
    "10+ Years Experience",
    "Certified Technicians",
    "On-time Delivery",
    "24/7 Support",
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 mt-6 text-sm text-muted-foreground">
      {trustPoints.map((point, index) => (
        <div key={index} className="flex items-center gap-1.5">
          <CheckCircle className="w-3.5 h-3.5 text-green-500" />
          <span>{point}</span>
          {index < trustPoints.length - 1 && (
            <span className="ml-4 text-border hidden md:inline">•</span>
          )}
        </div>
      ))}
    </div>
  );
};

export function TrustSection() {
  return <AnimatedTrustSection />;
}
