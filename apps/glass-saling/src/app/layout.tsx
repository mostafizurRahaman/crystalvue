import { cn } from "@/lib/utils";
import "./globals.css";
import AppLayout from "@/components/layouts/AppLayout";
import { poppins } from "@/configs/font";
import { ThemeProvider } from "next-themes";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo";
import { getSettingsServer } from "@/api";
import Script from "next/script";
import {
  generateOrganizationSchema,
  generateServiceBusinessSchema,
} from "@/lib/seo";

export async function generateMetadata() {
  let settings;
  try {
    // Use server-side function for better performance and caching
    settings = await getSettingsServer();
  } catch (error) {
    console.error("Error fetching settings for metadata:", error);
  }

  return generateSEOMetadata(
    {
      title: settings?.seoMetaTitle || undefined,
      description: settings?.seoMetaDescription || undefined,
      keywords: settings?.seoKeywords || undefined,
      image: settings?.metaImage?.url || undefined,
    },
    settings || undefined
  );
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let settings;
  try {
    // Use server-side function for better performance and caching
    settings = await getSettingsServer();
  } catch (error) {
    console.error("Error fetching settings for structured data:", error);
  }

  const organizationSchema = generateOrganizationSchema(settings || undefined);
  const businessSchema = generateServiceBusinessSchema(settings || undefined);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          id="organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <Script
          id="business-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(businessSchema),
          }}
        />
      </head>
      <body className={cn(poppins.className, poppins.variable, "antialiased")}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AppLayout>{children}</AppLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
