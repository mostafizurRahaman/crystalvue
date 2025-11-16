import { Metadata } from "next";
import { getSettingsServer, getAboutPageDataServer } from "@/api";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo";
import Script from "next/script";
import { generateWebPageSchema } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  let settings;
  let aboutData;
  try {
    // Use server-side function for better performance and caching
    settings = await getSettingsServer();
    const aboutResponse = await getAboutPageDataServer();
    if (aboutResponse.success) {
      aboutData = aboutResponse.data;
    }
  } catch (error) {
    console.error("Error fetching data for metadata:", error);
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";

  // Build description from about page data or use settings
  const description =
    aboutData?.heroText ||
    aboutData?.introSubtitle ||
    settings?.siteDescription ||
    "";

  // Build title from about page data
  const title = aboutData?.introTitle || "About Us";

  return generateSEOMetadata(
    {
      title,
      description,
      keywords: settings?.seoKeywords || undefined,
      url: siteUrl ? `${siteUrl}/about-us` : "/about-us",
      type: "website",
      image:
        aboutData?.bannerImage?.url || settings?.metaImage?.url || undefined,
    },
    settings || undefined
  );
}

export default async function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let settings;
  let aboutData;
  try {
    settings = await getSettingsServer();
    const aboutResponse = await getAboutPageDataServer();
    if (aboutResponse.success) {
      aboutData = aboutResponse.data;
    }
  } catch (error) {
    console.error("Error fetching data for schema:", error);
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
  const title = aboutData?.introTitle || "About Us";
  const description =
    aboutData?.heroText ||
    aboutData?.introSubtitle ||
    settings?.siteDescription ||
    "";

  const webpageSchema = generateWebPageSchema(
    title,
    description,
    siteUrl ? `${siteUrl}/about-us` : "/about-us",
    aboutData?.bannerImage?.url || settings?.metaImage?.url,
    settings || undefined
  );

  return (
    <>
      <Script
        id="about-page-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webpageSchema),
        }}
      />
      {children}
    </>
  );
}
