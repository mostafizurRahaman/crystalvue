import { Metadata } from "next";
import { GlobalSettings } from "@/api";

export interface SEOConfig {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  noindex?: boolean;
  nofollow?: boolean;
}

/** Helper: Convert human-readable time (e.g., "9:00 AM") to 24-hour format "HH:mm" */
function to24Hour(time: string) {
  const [hourMin, period] = time.split(" ");
  let hours = Number(hourMin.split(":")[0]);
  const minutes = Number(hourMin.split(":")[1]);
  if (period.toLowerCase() === "pm" && hours < 12) hours += 12;
  if (period.toLowerCase() === "am" && hours === 12) hours = 0;
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
}

/** Helper: Ensure URL is absolute */
function getFullUrl(url: string | undefined, baseUrl: string) {
  if (!url) return undefined;
  return url.startsWith("http") ? url : `${baseUrl}${url}`;
}

/** Helper: Clean social links by removing query params */
function cleanSocialLink(link?: string) {
  return link?.split("?")[0];
}

/** Generate comprehensive metadata for SEO */
export function generateMetadata(
  config: SEOConfig,
  settings?: GlobalSettings | null
): Metadata {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
  const siteTitle = settings?.siteTitle || "";
  const siteDescription = settings?.siteDescription || "";

  // Build title
  let title = config.title
    ? siteTitle
      ? `${config.title} | ${siteTitle}`
      : config.title
    : siteTitle;
  if (title && title.length > 75) {
    const truncated = title.substring(0, 72);
    const lastSpace = truncated.lastIndexOf(" ");
    title =
      lastSpace > 50
        ? truncated.substring(0, lastSpace) + "..."
        : truncated + "...";
  }

  // Build description
  let description = config.description || siteDescription || "";
  if (description.length > 160)
    description = description.substring(0, 157) + "...";

  const keywords = config.keywords || settings?.seoKeywords || "";
  const image = getFullUrl(config.image || settings?.metaImage?.url, siteUrl);
  const url = config.url || siteUrl;

  return {
    title,
    description,
    keywords: keywords ? keywords.split(",").map((k) => k.trim()) : undefined,
    authors: config.author ? [{ name: config.author }] : undefined,
    creator: siteTitle,
    publisher: siteTitle,
    robots: {
      index: !config.noindex,
      follow: !config.nofollow,
      googleBot: {
        index: !config.noindex,
        follow: !config.nofollow,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      type: config.type || "website",
      locale: "en_US",
      url,
      title,
      description,
      siteName: siteTitle,
      images: image
        ? [
            {
              url: image,
              ...(settings?.metaImage?.width && {
                width: settings.metaImage.width,
              }),
              ...(settings?.metaImage?.height && {
                height: settings.metaImage.height,
              }),
              alt: title,
            },
          ]
        : [],
      ...(config.publishedTime && { publishedTime: config.publishedTime }),
      ...(config.modifiedTime && { modifiedTime: config.modifiedTime }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : undefined,
      creator: settings?.socialMediaLinks?.twitter
        ? `@${settings.socialMediaLinks.twitter.split("/").pop()}`
        : undefined,
    },
    alternates: { canonical: url || undefined },
    ...(siteUrl && { metadataBase: new URL(siteUrl) }),
  };
}

/** Generate structured data for organization */
export function generateOrganizationSchema(
  settings?: GlobalSettings | null
): object {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
  const siteTitle = settings?.siteTitle || "";
  const logo = getFullUrl(settings?.logoImage?.url, siteUrl);

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteTitle,
    url: siteUrl,
    logo,
    description: settings?.siteDescription || "",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: settings?.contactPhone || "",
      contactType: "Customer Service",
      email: settings?.contactEmail || "",
      areaServed: settings?.officeAddress ? "Doha, Qatar" : undefined,
      availableLanguage: ["en"],
    },
    sameAs: settings?.socialMediaLinks
      ? [
          cleanSocialLink(settings.socialMediaLinks.facebook!),
          cleanSocialLink(settings.socialMediaLinks.instagram!),
          cleanSocialLink(settings.socialMediaLinks.twitter!),
          cleanSocialLink(settings.socialMediaLinks.linkedin!),
          cleanSocialLink(settings.socialMediaLinks.youtube!),
        ].filter(Boolean)
      : [],
    address: settings?.officeAddress
      ? {
          "@type": "PostalAddress",
          streetAddress: settings.officeAddress,
          addressCountry: "QA",
        }
      : undefined,
  };
}

/** Generate structured data for a webpage */
export function generateWebPageSchema(
  title: string,
  description: string,
  url: string,
  image?: string,
  settings?: GlobalSettings | null
): object {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
  const fullImageUrl = getFullUrl(image || settings?.metaImage?.url, siteUrl);

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
    url,
    image: fullImageUrl,
    inLanguage: "en-US",
    isPartOf: { "@type": "WebSite", name: title, url: siteUrl },
  };
}

/** Generate structured data for a LocalBusiness */
export function generateServiceBusinessSchema(
  settings?: GlobalSettings | null
): object {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
  const siteTitle = settings?.siteTitle || "";
  const logo = getFullUrl(settings?.logoImage?.url, siteUrl);

  const daysOpen = ["Monday", "Tuesday", "Wednesday", "Thursday", "Saturday"];
  const openingHours =
    settings?.businessHours?.openingText && settings?.businessHours?.closeText
      ? [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: daysOpen,
            opens: to24Hour(settings.businessHours.openingText),
            closes: to24Hour(settings.businessHours.closeText),
          },
        ]
      : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${siteUrl}#organization`,
    name: siteTitle,
    image: logo,
    description: settings?.siteDescription || "",
    address: settings?.officeAddress
      ? {
          "@type": "PostalAddress",
          streetAddress: settings.officeAddress,
          addressCountry: "QA",
        }
      : undefined,
    telephone: settings?.contactPhone,
    openingHoursSpecification: openingHours,
    url: siteUrl,
    sameAs: settings?.socialMediaLinks
      ? [
          cleanSocialLink(settings.socialMediaLinks.facebook!),
          cleanSocialLink(settings.socialMediaLinks.instagram!),
          cleanSocialLink(settings.socialMediaLinks.twitter!),
          cleanSocialLink(settings.socialMediaLinks.linkedin!),
          cleanSocialLink(settings.socialMediaLinks.youtube!),
        ].filter(Boolean)
      : [],
  };
}
