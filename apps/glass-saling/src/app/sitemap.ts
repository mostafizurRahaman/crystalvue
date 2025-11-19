import { MetadataRoute } from "next";
import { getAllCategoriesServer } from "@/api";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
  const baseUrl = siteUrl.replace(/\/$/, "") || "";

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about-us`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact-us`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/gallery`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/all-categories`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];

  // Dynamic routes - Categories
  let categoryRoutes: MetadataRoute.Sitemap = [];
  try {
    const categoriesResponse = await getAllCategoriesServer({
      isActive: true,
      limit: 100, // Backend max limit is 100
    });

    if (categoriesResponse.success && categoriesResponse.data) {
      categoryRoutes = categoriesResponse.data.map((category) => ({
        url: `${baseUrl}/all-categories/${category.id}`,
        lastModified: category.updatedAt
          ? new Date(category.updatedAt)
          : new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }));
    }
  } catch (error) {
    console.error("Error fetching categories for sitemap:", error);
  }

  // Dynamic routes - Services (if you have individual service pages)
  // Uncomment and adjust if you have service detail pages
  // let serviceRoutes: MetadataRoute.Sitemap = [];
  // try {
  //   const servicesResponse = await getAllServices({
  //     isActive: true,
  //     limit: 1000,
  //   });
  //
  //   if (servicesResponse.success && servicesResponse.data) {
  //     serviceRoutes = servicesResponse.data.map((service) => ({
  //       url: `${baseUrl}/services/${service.id}`,
  //       lastModified: service.updatedAt
  //         ? new Date(service.updatedAt)
  //         : new Date(),
  //       changeFrequency: "weekly" as const,
  //       priority: 0.7,
  //     }));
  //   }
  // } catch (error) {
  //   console.error("Error fetching services for sitemap:", error);
  // }

  return [...staticRoutes, ...categoryRoutes];
}
