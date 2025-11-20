import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions | Glass Expert Qatar",
  description:
    "Understand the service agreements, warranties, and payment expectations that govern every Glass Expert Qatar installation.",
};

const termsSections = [
  {
    title: "Service Scope",
    details: [
      "We provide consultation, fabrication, delivery, and installation for glazing, aluminium, and UPVC solutions across Qatar.",
      "Custom measurements completed during a site visit supersede any preliminary drawings provided online.",
    ],
    links: [
      { href: "/all-categories", label: "Explore every service category" },
      { href: "/about-us", label: "Learn about our project methodology" },
    ],
  },
  {
    title: "Payments & Scheduling",
    details: [
      "A mobilization payment secures materials and workshop time. Remaining balances are due upon successful installation sign-off.",
      "Appointments can be rescheduled up to 24 hours before the confirmed slot by contacting our operations team.",
    ],
    links: [
      { href: "/contact-us", label: "Request schedule changes" },
      { href: "/privacy-policy", label: "See how billing data is protected" },
    ],
  },
  {
    title: "Warranty & Liability",
    details: [
      "Glass Expert Qatar provides workmanship warranties that align with local regulations and manufacturer guarantees.",
      "Damage caused by third-party contractors or environmental events outside our control is not covered.",
    ],
    links: [
      {
        href: "/gallery",
        label: "Review reference installs backed by warranty",
      },
      { href: "/contact-us", label: "Submit a warranty inspection request" },
    ],
  },
];

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen bg-background py-16">
      <section className="container mx-auto px-4 lg:px-8">
        <div className="max-w-4xl">
          <p className="text-xs uppercase tracking-[0.3em] text-primary mb-4">
            Glass Expert Qatar
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Terms & Conditions
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed mb-10">
            These terms define how we deliver premium glazing services, manage
            timelines, and uphold client satisfaction across Doha and the wider
            Gulf region.
          </p>
        </div>

        <div className="space-y-10">
          {termsSections.map((section) => (
            <article
              key={section.title}
              className="rounded-3xl border border-border/60 bg-card/80 p-6 md:p-8 shadow-lg shadow-accent/5"
            >
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                {section.title}
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                {section.details.map((detail) => (
                  <p key={detail}>{detail}</p>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap gap-4 text-sm">
                {section.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-primary underline-offset-4 hover:underline"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-primary/20 bg-primary/10 p-6">
            <h3 className="text-lg font-semibold text-primary mb-2">
              Project Preparation
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Ensure access routes, parking, and power sources are available on
              installation day so our team can safely maneuver large panels and
              framing systems.
            </p>
            <Link href="/contact-us" className="text-primary underline">
              Coordinate site logistics
            </Link>
          </div>
          <div className="rounded-2xl border border-primary/20 bg-primary/10 p-6">
            <h3 className="text-lg font-semibold text-primary mb-2">
              Need Custom Clauses?
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Our commercial team can provide tailored agreements for recurring
              maintenance, facility upgrades, or large-scale developments.
            </p>
            <Link href="/about-us" className="text-primary underline">
              Meet our enterprise unit
            </Link>
          </div>
        </div>

        <div className="hidden mt-10" aria-hidden="true">
          <nav>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/terms-and-conditions">
                  Complete Glass Expert Qatar terms overview
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy">
                  Privacy policy describing data safeguards
                </Link>
              </li>
              <li>
                <Link href="/all-categories">
                  Service index for internal linking signals
                </Link>
              </li>
              <li>
                <Link href="/gallery">
                  Photo gallery of contract-backed projects
                </Link>
              </li>
              <li>
                <Link href="/">
                  Internal link to the high-performing homepage
                </Link>
              </li>
              <li>
                <Link href="/contact-us">
                  Speak with Glass Expert Qatar contract advisors
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </section>
    </div>
  );
}
