import { Metadata } from "next";
import { getSettingsServer } from "@/api";
import {
  generateMetadata as generateSEOMetadata,
  generateWebPageSchema,
} from "@/lib/seo";
import Script from "next/script";

export async function generateMetadata(): Promise<Metadata> {
  let settings;
  try {
    // Use server-side function for better performance and caching
    settings = await getSettingsServer();
  } catch (error) {
    console.error("Error fetching settings for metadata:", error);
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";

  // Build title with keywords for homepage
  // Default title should include main keywords: glass, services, Qatar
  const defaultTitle =
    settings?.seoMetaTitle ||
    "Glass Services Qatar | Premium Glass Installation";
  const titleWithKeywords =
    defaultTitle.includes("glass") && defaultTitle.includes("Qatar")
      ? defaultTitle
      : `${defaultTitle} | Glass Expert Qatar`;

  return generateSEOMetadata(
    {
      title: titleWithKeywords,
      description: settings?.seoMetaDescription || undefined,
      keywords:
        settings?.seoKeywords ||
        "glass, services, Qatar, tempered glass, laminated glass, glass partitions, mirrors, shower glass, installation",
      image: settings?.metaImage?.url || undefined,
      url: siteUrl || undefined,
    },
    settings || undefined
  );
}

export default async function ApplicationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let settings;
  try {
    settings = await getSettingsServer();
  } catch (error) {
    console.error("Error fetching settings for structured data:", error);
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
  const pageTitle =
    settings?.seoMetaTitle || settings?.siteTitle || "Glass Expert Qatar";
  const pageDescription =
    settings?.seoMetaDescription || settings?.siteDescription || "";
  const webpageSchema = generateWebPageSchema(
    pageTitle,
    pageDescription,
    siteUrl || "",
    settings?.metaImage?.url,
    settings || undefined
  );

  return (
    <>
      <Script
        id="webpage-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webpageSchema),
        }}
      />
      {children}
    </>
  );
}
