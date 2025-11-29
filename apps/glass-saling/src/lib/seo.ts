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

  // Build title with keywords, limit to 75 characters for SEO
  let title = config.title
    ? siteTitle
      ? `${config.title} | ${siteTitle}`
      : config.title
    : siteTitle || "";

  // Truncate title to 75 characters (optimal for search engines)
  // Ensure we don't cut in the middle of a word if possible
  if (title.length > 75) {
    const truncated = title.substring(0, 72);
    const lastSpace = truncated.lastIndexOf(" ");
    title =
      lastSpace > 50
        ? truncated.substring(0, lastSpace) + "..."
        : truncated + "...";
  }

  // Truncate description to 160 characters (optimal for search engines)
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
      ...(config.publishedTime && {
        publishedTime: config.publishedTime,
      }),
      ...(config.modifiedTime && {
        modifiedTime: config.modifiedTime,
      }),
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

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteTitle,
    url: siteUrl,
    logo: `./logo.png`,
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
          settings.socialMediaLinks.facebook,
          settings.socialMediaLinks.instagram,
          settings.socialMediaLinks.twitter,
          settings.socialMediaLinks.linkedin,
          settings.socialMediaLinks.youtube,
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
 * Generate structured data for a service business
 */
export function generateServiceBusinessSchema(
  settings?: GlobalSettings | null
): object {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
  const siteTitle = settings?.siteTitle || "";

  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${siteUrl}#organization`,
    name: siteTitle,
    image: settings?.logoImage?.url
      ? siteUrl
        ? `${siteUrl}${settings.logoImage.url}`
        : settings.logoImage.url
      : undefined,
    description: settings?.siteDescription || "",
    address: settings?.officeAddress
      ? {
          "@type": "PostalAddress",
          streetAddress: settings.officeAddress,
          addressCountry: "QA",
        }
      : undefined,
    telephone: settings?.contactPhone || undefined,
    openingHoursSpecification:
      settings?.businessHours?.openingText && settings?.businessHours?.closeText
        ? [
            {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
              ],
              opens: settings.businessHours.openingText,
              closes: settings.businessHours.closeText,
            },
          ]
        : undefined,
    url: siteUrl,
    sameAs: settings?.socialMediaLinks
      ? [
          settings.socialMediaLinks.facebook,
          settings.socialMediaLinks.instagram,
          settings.socialMediaLinks.twitter,
          settings.socialMediaLinks.linkedin,
          settings.socialMediaLinks.youtube,
        ].filter(Boolean)
      : [],
  };
}
