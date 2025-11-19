import { Metadata } from "next";
import { getSettingsServer, getAllCategoriesServer } from "@/api";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo";
import Script from "next/script";
import { generateWebPageSchema } from "@/lib/seo";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categoryId: string }>;
}): Promise<Metadata> {
  const { categoryId } = await params;
  let settings;
  let category;

  try {
    // Use server-side function for better performance and caching
    settings = await getSettingsServer();
    // Fetch all categories and find the one matching the ID
    // Note: Backend max limit is 100, so we use that
    const categoriesResponse = await getAllCategoriesServer({
      limit: 100,
    });

    if (categoriesResponse.success && categoriesResponse.data) {
      // Try multiple ID comparison methods to handle different formats
      category = categoriesResponse.data.find(
        (cat) =>
          cat.id === categoryId ||
          cat.id.toString() === categoryId ||
          String(cat.id) === String(categoryId)
      );

      // Debug logging (remove in production if not needed)
      if (!category && categoriesResponse.data.length > 0) {
        console.log("Category ID from URL:", categoryId);
        console.log(
          "Available category IDs:",
          categoriesResponse.data.map((c) => c.id).slice(0, 5)
        );
      }
    }
  } catch (error) {
    console.error("Error fetching data for metadata:", error);
  }

  if (!category) {
    return generateSEOMetadata(
      {
        title: undefined,
        description: settings?.siteDescription || undefined,
        noindex: true,
      },
      settings || undefined
    );
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";

  return generateSEOMetadata(
    {
      title: category.name,
      description: category.description || settings?.siteDescription || "",
      keywords: settings?.seoKeywords || undefined,
      url: siteUrl
        ? `${siteUrl}/all-categories/${categoryId}`
        : `/all-categories/${categoryId}`,
      type: "website",
      image: settings?.metaImage?.url || undefined,
    },
    settings || undefined
  );
}

export default async function CategoryLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ categoryId: string }>;
}) {
  const { categoryId } = await params;
  let settings;
  let category;

  try {
    settings = await getSettingsServer();
    // Fetch all categories and find the one matching the ID
    // Note: Backend max limit is 100, so we use that
    const categoriesResponse = await getAllCategoriesServer({
      limit: 100,
    });

    if (categoriesResponse.success && categoriesResponse.data) {
      // Try multiple ID comparison methods to handle different formats
      category = categoriesResponse.data.find(
        (cat) =>
          cat.id === categoryId ||
          cat.id.toString() === categoryId ||
          String(cat.id) === String(categoryId)
      );

      // Debug logging (remove in production if not needed)
      if (!category && categoriesResponse.data.length > 0) {
        console.log("Category ID from URL:", categoryId);
        console.log(
          "Available category IDs:",
          categoriesResponse.data.map((c) => c.id).slice(0, 5)
        );
      }
    }
  } catch (error) {
    console.error("Error fetching category for schema:", error);
  }

  // If category is not found, show 404
  if (!category) {
    notFound();
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
  const description = category.description || settings?.siteDescription || "";

  const webpageSchema = generateWebPageSchema(
    category.name,
    description,
    siteUrl
      ? `${siteUrl}/all-categories/${categoryId}`
      : `/all-categories/${categoryId}`,
    settings?.metaImage?.url,
    settings || undefined
  );

  return (
    <>
      <Script
        id="category-page-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webpageSchema),
        }}
      />
      {children}
    </>
  );
}
