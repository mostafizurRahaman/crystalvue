"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getAllGalleries, type GalleryCategory } from "@/api";
import Image from "next/image";
import {
  CTASection,
  TestimonialsSection,
  TrustSection,
} from "@/components/home";

const galleryCategoryOptions: {
  value: GalleryCategory | "all";
  label: string;
}[] = [
  { value: "all", label: "All Projects" },
  { value: "SHOWER_ENCLOSURES", label: "Shower Enclosures" },
  { value: "GLASS_DOORS", label: "Glass doors" },
  { value: "RAILINGS", label: "Railings" },
  { value: "WINDOWS", label: "Windows" },
  { value: "UPVC", label: "UPVC" },
];

const Gallery = () => {
  const [activeFilter, setActiveFilter] = useState<GalleryCategory | "all">(
    "all"
  );
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const {
    data: galleriesResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["galleries", activeFilter, currentPage],
    queryFn: () =>
      getAllGalleries({
        page: currentPage,
        limit: itemsPerPage,
        galleryCategory: activeFilter === "all" ? undefined : activeFilter,
        isActive: true,
        sortBy: "createdAt",
        sortOrder: "desc",
      }),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 3,
  });

  const galleries = galleriesResponse?.data || [];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <h2 className="hidden">Glass Expert Qatar Gallery Hero</h2>
      <section className="py-20 gradient-hero text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">Our Gallery</h1>
            <p className="text-xl text-white/90">
              Explore our portfolio of completed projects and see the quality of
              our work
            </p>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <h2 className="hidden">Gallery Category Filters</h2>
      <section className="py-8 bg-card sticky top-16 z-40 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-3 justify-center">
            {galleryCategoryOptions.map((cat) => (
              <Button
                key={cat.value}
                onClick={() => {
                  setActiveFilter(cat.value);
                  setCurrentPage(1);
                }}
                variant={activeFilter === cat.value ? "default" : "outline"}
                className={
                  activeFilter === cat.value
                    ? "gradient-primary text-white border-0"
                    : ""
                }
              >
                {cat.label}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <h2 className="hidden">Glass Expert Qatar Project Gallery</h2>
      <section className="py-20">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 12 }).map((_, index) => (
                <Card key={index} className="glass-card py-0! overflow-hidden">
                  <Skeleton className="aspect-4/3 w-full" />
                </Card>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-lg text-destructive">
                Failed to load gallery. Please try again later.
              </p>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {galleries.map((gallery) => (
                  <Card
                    key={gallery.id}
                    className="glass-card py-0! overflow-hidden group cursor-pointer hover:shadow-xl transition-all"
                  >
                    <div className="aspect-4/3 relative overflow-hidden">
                      {gallery.image?.url ? (
                        <Image
                          src={gallery.image.url}
                          alt={
                            gallery.image.altText ||
                            gallery.caption ||
                            "Gallery image"
                          }
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="aspect-4/3 bg-linear-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                          <p className="text-muted-foreground">No image</p>
                        </div>
                      )}
                      {gallery.caption && (
                        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity flex items-end">
                          <div className="p-4 text-white w-full">
                            <p className="text-sm font-medium line-clamp-2">
                              {gallery.caption}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>

              {galleries.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-lg text-muted-foreground">
                    No projects found in this category
                  </p>
                </div>
              )}

              {/* Pagination */}
              {galleriesResponse?.pagination &&
                galleriesResponse.pagination.total_pages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-8">
                    <Button
                      variant="outline"
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(1, prev - 1))
                      }
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      Page {galleriesResponse.pagination.page} of{" "}
                      {galleriesResponse.pagination.total_pages}
                    </span>
                    <Button
                      variant="outline"
                      onClick={() =>
                        setCurrentPage((prev) =>
                          Math.min(
                            galleriesResponse.pagination.total_pages,
                            prev + 1
                          )
                        )
                      }
                      disabled={
                        currentPage === galleriesResponse.pagination.total_pages
                      }
                    >
                      Next
                    </Button>
                  </div>
                )}
            </>
          )}
        </div>
      </section>

      {/* Trusted Section */}
      <h2 className="hidden">Glass Expert Qatar Trust Badges</h2>
      <TrustSection />

      {/* CTA Section */}
      <h2 className="hidden">Request A Gallery Consultation CTA</h2>
      <CTASection />

      {/* Testimonials Section */}
      <h2 className="hidden">Gallery Page Customer Testimonials</h2>
      <TestimonialsSection
        title="What Our Clients Say"
        subtitle="Join thousands of satisfied customers who have transformed their business with our solutions"
        badge="Testimonials"
      />
    </div>
  );
};

export default Gallery;
