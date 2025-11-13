"use client";
import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  X,
  ArrowUpDown,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { ServiceItemCard } from "@/components/cards";
import { ContactFormPopup } from "@/components/contact-form-popup";
import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

import { useServices } from "@/hooks";
import { Service } from "@/api";
import { cn } from "@/lib/utils";
import {
  CTASection,
  TestimonialsSection,
  TrustSection,
} from "@/components/home";

// Sort options matching backend API fields
const sortOptions = [
  { value: "name-asc", label: "Name (A-Z)" },
  { value: "name-desc", label: "Name (Z-A)" },
  { value: "createdAt-asc", label: "Oldest First" },
  { value: "createdAt-desc", label: "Newest First" },
];

// Items per page options
const itemsPerPageOptions = [
  5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 60, 70, 80, 90, 100,
];

const CategoryServicesPage = () => {
  const params = useParams();
  const router = useRouter();
  const categoryId = params.categoryId as string;

  // State management
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [sortBy, setSortBy] = useState("createdAt-desc");
  const [isContactFormOpen, setIsContactFormOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | undefined>(
    undefined
  );

  // Filters
  const [isPremium, setIsPremium] = useState<boolean | undefined>(undefined);
  const [isActive, setIsActive] = useState<boolean | undefined>(true);

  const { data: servicesResponse, isLoading } = useServices({
    page: currentPage,
    limit: itemsPerPage,
    sortBy: sortBy.split("-")[0],
    sortOrder: sortBy.split("-")[1] as "asc" | "desc",
    categoryId: categoryId,
    isActive: isActive,
    isPremium: isPremium,
    search: searchTerm || undefined,
  });

  // Get data from API response
  const services = useMemo(
    () => servicesResponse?.data || [],
    [servicesResponse?.data]
  );
  const pagination = servicesResponse?.pagination;
  const totalItems = pagination?.total_items || 0;
  const totalPages = pagination?.total_pages || 0;

  // Get category info from first service (if available)
  const categoryName = services[0]?.parentCategory?.name || "Services";

  // Calculate statistics
  const stats = useMemo(() => {
    const total = services.length;
    const premium = services.filter((s) => s.isPremium).length;
    const regular = total - premium;

    return {
      total,
      premium,
      regular,
    };
  }, [services]);

  // Reset page when search or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortBy, itemsPerPage, isPremium, isActive]);

  // Handlers
  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 300, behavior: "smooth" });
    }
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    setCurrentPage(1);
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value));
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setIsPremium(undefined);
    setIsActive(true);
    setSortBy("createdAt-desc");
  };

  const handleBuyNow = (service: Service) => {
    setSelectedService(service);
    setIsContactFormOpen(true);
  };

  const activeFiltersCount =
    (searchTerm ? 1 : 0) +
    (isPremium !== undefined ? 1 : 0) +
    (isActive === false ? 1 : 0);

  // Generate page numbers for pagination
  const generatePageNumbers = () => {
    const pages = [];
    const maxVisible = 7;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-16 gradient-hero text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="mb-6 text-white hover:bg-white/20"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Categories
            </Button>
            <Typography variant="Bold_H1" className="text-5xl mb-6 text-white">
              {categoryName}
            </Typography>
            <Typography
              variant="Regular_H4"
              className="text-xl text-white/90 mb-8"
            >
              Explore our comprehensive range of services in this category
            </Typography>

            {/* Enhanced Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search services..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-12 pr-12 h-14 text-base bg-white text-gray-900 border-0 shadow-lg"
                />
                {searchTerm && (
                  <Button
                    onClick={() => handleSearch("")}
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters and Controls Bar */}
      <section className="sticky top-0 z-40 bg-background border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Left side - Results count and filters */}
            <div className="flex flex-wrap gap-4">
              <Typography
                variant="Regular_H5"
                className="text-muted-foreground"
              >
                {totalItems} {totalItems === 1 ? "Service" : "Services"}
              </Typography>

              {/* Filters */}
              <div className="flex items-center gap-4">
                {/* Premium Filter */}
                <div className="flex flex-col gap-1">
                  <Label className="text-xs text-muted-foreground font-medium">
                    Premium
                  </Label>
                  <Select
                    value={
                      isPremium === undefined ? "all" : isPremium.toString()
                    }
                    onValueChange={(val) =>
                      setIsPremium(val === "all" ? undefined : val === "true")
                    }
                  >
                    <SelectTrigger className="w-36 h-9">
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="true">Premium Only</SelectItem>
                      <SelectItem value="false">Regular Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Active Filter */}
                <div className="flex flex-col gap-1">
                  <Label className="text-xs text-muted-foreground font-medium">
                    Status
                  </Label>
                  <Select
                    value={isActive === undefined ? "all" : isActive.toString()}
                    onValueChange={(val) =>
                      setIsActive(val === "all" ? undefined : val === "true")
                    }
                  >
                    <SelectTrigger className="w-36 h-9">
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="true">Active Only</SelectItem>
                      <SelectItem value="false">Inactive Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Clear Filters Button */}
                {activeFiltersCount > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearAllFilters}
                    className="h-8 text-sm !mt-auto"
                  >
                    Clear filters
                  </Button>
                )}
              </div>
            </div>

            {/* Right side - Sorting options */}
            <div className="flex items-center gap-3">
              {/* Sort Dropdown */}
              <Select value={sortBy} onValueChange={handleSortChange}>
                <SelectTrigger className="w-40">
                  <ArrowUpDown className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Items per page */}
              <Select
                value={itemsPerPage.toString()}
                onValueChange={handleItemsPerPageChange}
              >
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {itemsPerPageOptions.map((option) => (
                    <SelectItem key={option} value={option.toString()}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex gap-8">
            {/* Services Grid */}
            <div className="flex-1">
              {isLoading ? (
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {Array.from({ length: itemsPerPage }).map((_, index) => (
                    <div
                      key={index}
                      className="h-96 bg-muted/20 animate-pulse rounded-lg"
                    />
                  ))}
                </div>
              ) : services.length > 0 ? (
                <>
                  <div className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                    {services.map((service: Service) => (
                      <ServiceItemCard
                        key={service.id}
                        title={service.name}
                        tagline={service.tagline}
                        image={service.image?.url || "/placeholder.jpg"}
                        isPremium={service.isPremium}
                        badge={service.isPremium ? "Premium" : undefined}
                        serviceAddons={service.serviceAddons}
                        onBuyNow={() => handleBuyNow(service)}
                        onContactUs={() => {
                          router.push(`/contact-us`);
                        }}
                      />
                    ))}
                  </div>

                  {/* Enhanced Pagination */}
                  {totalPages > 1 && (
                    <div className="mt-12 flex flex-col items-center gap-4">
                      {/* Pagination Info */}
                      <Typography
                        variant="Regular_H6"
                        className="text-muted-foreground"
                      >
                        Showing {(currentPage - 1) * itemsPerPage + 1}-
                        {Math.min(currentPage * itemsPerPage, totalItems)} of{" "}
                        {totalItems} results
                      </Typography>

                      {/* Pagination Controls */}
                      <div className="flex items-center gap-2">
                        {/* First Page */}
                        <Button
                          onClick={() => handlePageChange(1)}
                          disabled={currentPage === 1}
                          variant="outline"
                          size="icon"
                          className="h-10 w-10"
                        >
                          <ChevronsLeft className="h-4 w-4" />
                        </Button>

                        {/* Previous Page */}
                        <Button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          variant="outline"
                          size="icon"
                          className="h-10 w-10"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>

                        {/* Page Numbers */}
                        <div className="flex items-center gap-1">
                          {generatePageNumbers().map((page, index) =>
                            page === "..." ? (
                              <span
                                key={`ellipsis-${index}`}
                                className="px-3 text-muted-foreground"
                              >
                                ...
                              </span>
                            ) : (
                              <Button
                                key={page}
                                onClick={() => handlePageChange(page as number)}
                                variant={
                                  currentPage === page ? "default" : "outline"
                                }
                                size="sm"
                                className={cn(
                                  "h-10 min-w-[40px]",
                                  currentPage === page &&
                                    "gradient-primary text-white border-0"
                                )}
                              >
                                {page}
                              </Button>
                            )
                          )}
                        </div>

                        {/* Next Page */}
                        <Button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          variant="outline"
                          size="icon"
                          className="h-10 w-10"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>

                        {/* Last Page */}
                        <Button
                          onClick={() => handlePageChange(totalPages)}
                          disabled={currentPage === totalPages}
                          variant="outline"
                          size="icon"
                          className="h-10 w-10"
                        >
                          <ChevronsRight className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Go to page input */}
                      <div className="flex items-center gap-2">
                        <Typography
                          variant="Regular_H6"
                          className="text-muted-foreground"
                        >
                          Go to page:
                        </Typography>
                        <Input
                          type="number"
                          min={1}
                          max={totalPages}
                          value={currentPage}
                          onChange={(e) => {
                            const page = parseInt(e.target.value);
                            if (!isNaN(page)) {
                              handlePageChange(page);
                            }
                          }}
                          className="w-20 h-10"
                        />
                        <Typography
                          variant="Regular_H6"
                          className="text-muted-foreground"
                        >
                          of {totalPages}
                        </Typography>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-16">
                  <Typography
                    variant="Regular_H3"
                    className="text-muted-foreground mb-4"
                  >
                    No services found
                  </Typography>
                  <Typography
                    variant="Regular_H6"
                    className="text-muted-foreground mb-8"
                  >
                    {searchTerm || activeFiltersCount > 0
                      ? "Try adjusting your filters or search terms."
                      : "No services available in this category at the moment."}
                  </Typography>
                  {(searchTerm || activeFiltersCount > 0) && (
                    <Button
                      onClick={clearAllFilters}
                      variant="outline"
                      size="lg"
                    >
                      Clear All Filters
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Trusted Section */}
      <TrustSection />

      {/* CTA Section */}
      <CTASection />

      {/* Testimonials Section */}
      <TestimonialsSection
        title="What Our Clients Say"
        subtitle="Join thousands of satisfied customers who have transformed their business with our solutions"
        badge="Testimonials"
      />

      {/* Contact Form Popup */}
      <ContactFormPopup
        isOpen={isContactFormOpen}
        onClose={() => setIsContactFormOpen(false)}
        selectedService={selectedService}
      />
    </div>
  );
};

export default CategoryServicesPage;
