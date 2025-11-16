import { Metadata } from "next";
import { getSettingsServer } from "@/api";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo";
import Script from "next/script";
import { generateWebPageSchema } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  let settings;
  try {
    // Use server-side function for better performance and caching
    settings = await getSettingsServer();
  } catch (error) {
    console.error("Error fetching settings for metadata:", error);
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";

  return generateSEOMetadata(
    {
      title: "Contact Us",
      description: settings?.siteDescription || "",
      keywords: settings?.seoKeywords || undefined,
      url: siteUrl ? `${siteUrl}/contact-us` : "/contact-us",
      type: "website",
    },
    settings || undefined
  );
}

export default async function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let settings;
  try {
    settings = await getSettingsServer();
  } catch (error) {
    console.error("Error fetching settings for schema:", error);
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
  const webpageSchema = generateWebPageSchema(
    "Contact Us",
    settings?.siteDescription || "",
    siteUrl ? `${siteUrl}/contact-us` : "/contact-us",
    settings?.metaImage?.url,
    settings || undefined
  );

  return (
    <>
      <Script
        id="contact-page-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webpageSchema),
        }}
      />
      {children}
    </>
  );
}
