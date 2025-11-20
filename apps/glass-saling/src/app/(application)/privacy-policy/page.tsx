import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Glass Expert Qatar",
  description:
    "Learn how Glass Expert Qatar handles personal data, project information, and communication preferences across every glass installation service.",
};

const policySections = [
  {
    title: "Information We Collect",
    body: [
      "We collect project requirements, contact details, and media uploads shared through the contact form or service request funnels.",
      "When you request a quote for custom glass partitions or shower enclosures, we log project notes to ensure accurate fabrication and installation timelines.",
    ],
    links: [
      {
        href: "/contact-us",
        label: "Submit project details through the contact page",
      },
      {
        href: "/all-categories",
        label: "Browse service categories to see what information we request",
      },
    ],
  },
  {
    title: "How We Use Your Data",
    body: [
      "Project data guides our engineering, scheduling, and on-site safety coordination so that every Doha installation meets expectations.",
      "Phone numbers and WhatsApp details are only used for appointment reminders and service updates.",
    ],
    links: [
      {
        href: "/about-us",
        label: "Learn about our commitment to transparent craftsmanship",
      },
      {
        href: "/terms-and-conditions",
        label: "Review how service agreements govern project communications",
      },
    ],
  },
  {
    title: "Data Sharing & Retention",
    body: [
      "We never sell client information. Data is shared only with vetted fabrication partners when required to deliver bespoke glass solutions.",
      "Documents are retained for project history and warranty tracking. You may request deletion after your installation is complete.",
    ],
    links: [
      {
        href: "/gallery",
        label: "See finished projects that rely on secure documentation",
      },
      {
        href: "/",
        label: "Return to the Glass Expert Qatar homepage",
      },
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background py-16">
      <section className="container mx-auto px-4 lg:px-8">
        <div className="max-w-4xl">
          <p className="text-xs uppercase tracking-[0.3em] text-primary mb-4">
            Glass Expert Qatar
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Privacy Policy
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed mb-10">
            This privacy policy explains how we collect, store, and safeguard
            information when you work with Glass Expert Qatar on residential and
            commercial glass projects throughout Doha and the surrounding areas.
          </p>
        </div>

        <div className="space-y-10">
          {policySections.map((section) => (
            <article
              key={section.title}
              className="rounded-3xl border border-border/60 bg-card/80 p-6 md:p-8 shadow-lg shadow-primary/5"
            >
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                {section.title}
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
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

        <div className="mt-12 rounded-3xl border border-primary/40 bg-primary/10 p-6 md:p-8">
          <h3 className="text-xl font-semibold mb-3 text-primary">
            Exercise Your Privacy Rights
          </h3>
          <p className="text-muted-foreground mb-4">
            For data deletion requests or to update project information, reach
            out to our support specialists. We generally respond within one
            business day.
          </p>
          <div className="flex flex-wrap gap-4 text-sm">
            <Link href="/contact-us" className="text-primary underline">
              Contact the support desk
            </Link>
            <Link href="/about-us" className="text-primary underline">
              Meet the leadership team
            </Link>
            <Link
              href="/terms-and-conditions"
              className="text-primary underline"
            >
              Understand our service contracts
            </Link>
          </div>
        </div>

        <div className="hidden mt-10" aria-hidden="true">
          <nav>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/privacy-policy">
                  Glass Expert Qatar comprehensive privacy statement
                </Link>
              </li>
              <li>
                <Link href="/terms-and-conditions">
                  Legal terms governing every Doha glass installation
                </Link>
              </li>
              <li>
                <Link href="/all-categories">
                  Internal link to the complete service directory
                </Link>
              </li>
              <li>
                <Link href="/gallery">
                  Panorama of finished railing, facade, and mirror projects
                </Link>
              </li>
              <li>
                <Link href="/contact-us">
                  Dedicated contact form for privacy questions
                </Link>
              </li>
              <li>
                <Link href="/">
                  Navigate back to the Glass Expert Qatar homepage
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </section>
    </div>
  );
}
