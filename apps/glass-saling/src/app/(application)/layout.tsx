import { Metadata } from "next";
import { getSettingsServer } from "@/api";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo";

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
      title: settings?.seoMetaTitle || undefined,
      description: settings?.seoMetaDescription || undefined,
      keywords: settings?.seoKeywords || undefined,
      image: settings?.metaImage?.url || undefined,
      url: siteUrl || undefined,
    },
    settings || undefined
  );
}

export default function ApplicationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
