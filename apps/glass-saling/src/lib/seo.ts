/* eslint-disable prefer-const */
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

/**
 * Convert human-readable time (e.g., "9:00 AM") to 24-hour format "HH:mm"
 */
function convertTo24Hour(time: string) {
  const [hourMin, period] = time.split(" ");
  let [hours, minutes] = hourMin.split(":").map(Number);
  if (period.toLowerCase() === "pm" && hours < 12) hours += 12;
  if (period.toLowerCase() === "am" && hours === 12) hours = 0;
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
}

/**
 * Generate comprehensive metadata for SEO
 */
export function generateMetadata(
  config: SEOConfig,
  settings?: GlobalSettings | null
): Metadata {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
  const siteTitle = settings?.siteTitle || "";
  const siteDescription = settings?.siteDescription || "";
  const defaultImage = settings?.metaImage?.url;

  // Build title
  let title = config.title
    ? siteTitle
      ? `${config.title} | ${siteTitle}`
      : config.title
    : siteTitle || "";

  // Truncate title to 75 characters
  if (title.length > 75) {
    const truncated = title.substring(0, 72);
    const lastSpace = truncated.lastIndexOf(" ");
    title =
      lastSpace > 50
        ? truncated.substring(0, lastSpace) + "..."
        : truncated + "...";
  }

  // Truncate description to 160 characters
  let description = config.description || siteDescription || "";
  if (description.length > 160) {
    description = description.substring(0, 157) + "...";
  }

  const keywords = config.keywords || settings?.seoKeywords || "";
  const image = config.image || defaultImage;
  const url = config.url || siteUrl;
  const fullImageUrl = image
    ? image.startsWith("http")
      ? image
      : siteUrl
        ? `${siteUrl}${image}`
        : image
    : undefined;

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
      images: fullImageUrl
        ? [
            {
              url: fullImageUrl,
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
      images: fullImageUrl ? [fullImageUrl] : undefined,
      creator: settings?.socialMediaLinks?.twitter
        ? `@${settings.socialMediaLinks.twitter.split("/").pop()}`
        : undefined,
    },
    alternates: {
      canonical: url || undefined,
    },
    ...(siteUrl && { metadataBase: new URL(siteUrl) }),
  };
}

/**
 * Generate structured data (JSON-LD) for organization
 */
export function generateOrganizationSchema(
  settings?: GlobalSettings | null
): object {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
  const siteTitle = settings?.siteTitle || "";
  const fullLogoUrl = settings?.logoImage?.url
    ? settings.logoImage.url.startsWith("http")
      ? settings.logoImage.url
      : `${siteUrl}${settings.logoImage.url}`
    : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteTitle,
    url: siteUrl,
    logo: fullLogoUrl,
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
          settings.socialMediaLinks.facebook?.split("?")[0],
          settings.socialMediaLinks.instagram?.split("?")[0],
          settings.socialMediaLinks.twitter?.split("?")[0],
          settings.socialMediaLinks.linkedin?.split("?")[0],
          settings.socialMediaLinks.youtube?.split("?")[0],
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

/**
 * Generate structured data for a webpage
 */
export function generateWebPageSchema(
  title: string,
  description: string,
  url: string,
  image?: string,
  settings?: GlobalSettings | null
): object {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
  const fullImageUrl = image
    ? image.startsWith("http")
      ? image
      : siteUrl
        ? `${siteUrl}${image}`
        : image
    : settings?.metaImage?.url
      ? settings.metaImage.url.startsWith("http")
        ? settings.metaImage.url
        : siteUrl
          ? `${siteUrl}${settings.metaImage.url}`
          : settings.metaImage.url
      : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
    url,
    image: fullImageUrl,
    inLanguage: "en-US",
    isPartOf: {
      "@type": "WebSite",
      name: title,
      url: siteUrl,
    },
  };
}

/**
 * Generate structured data for a service business (LocalBusiness)
 */
export function generateServiceBusinessSchema(
  settings?: GlobalSettings | null
): object {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
  const siteTitle = settings?.siteTitle || "";
  const fullLogoUrl = settings?.logoImage?.url
    ? settings.logoImage.url.startsWith("http")
      ? settings.logoImage.url
      : `${siteUrl}${settings.logoImage.url}`
    : undefined;

  // Handle opening hours
  const daysOpen = ["Monday", "Tuesday", "Wednesday", "Thursday", "Saturday"]; // Friday closed
  const openingHoursSpec =
    settings?.businessHours?.openingText && settings?.businessHours?.closeText
      ? [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: daysOpen,
            opens: convertTo24Hour(settings.businessHours.openingText),
            closes: convertTo24Hour(settings.businessHours.closeText),
          },
        ]
      : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${siteUrl}#organization`,
    name: siteTitle,
    image: fullLogoUrl,
    description: settings?.siteDescription || "",
    address: settings?.officeAddress
      ? {
          "@type": "PostalAddress",
          streetAddress: settings.officeAddress,
          addressCountry: "QA",
        }
      : undefined,
    telephone: settings?.contactPhone || undefined,
    openingHoursSpecification: openingHoursSpec,
    url: siteUrl,
    sameAs: settings?.socialMediaLinks
      ? [
          settings.socialMediaLinks.facebook?.split("?")[0],
          settings.socialMediaLinks.instagram?.split("?")[0],
          settings.socialMediaLinks.twitter?.split("?")[0],
          settings.socialMediaLinks.linkedin?.split("?")[0],
          settings.socialMediaLinks.youtube?.split("?")[0],
        ].filter(Boolean)
      : [],
  };
}
