"use client";
import { useState, useEffect } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  X,
  Grid3x3,
  List,
  ArrowUpDown,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { ServiceCategoryCard } from "@/components/cards";
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
import { useCategories } from "@/hooks";
import { Category } from "@/api";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import {
  CTASection,
  TestimonialsSection,
  TrustSection,
} from "@/components/home";
// View modes
type ViewMode = "grid" | "list";

// Sort options matching backend API fields
const sortOptions = [
  { value: "name-asc", label: "Name (A-Z)" },
  { value: "name-desc", label: "Name (Z-A)" },
  { value: "createdAt-asc", label: "Oldest First" },
  { value: "createdAt-desc", label: "Newest First" },
  { value: "updatedAt-asc", label: "Recently Updated" },
  { value: "sortOrder-asc", label: "Sort Order" },
];

// Items per page options
const itemsPerPageOptions = [2, 12, 24, 36, 48];

// Filter types (example - adjust based on your actual data)
const categoryTypes = [
  { value: "residential", label: "Residential" },
  { value: "commercial", label: "Commercial" },
  { value: "automotive", label: "Automotive" },
  { value: "specialty", label: "Specialty" },
];

const priceRanges = [
  { value: "0-500", label: "Under $500" },
  { value: "500-1000", label: "$500 - $1,000" },
  { value: "1000-5000", label: "$1,000 - $5,000" },
  { value: "5000+", label: "Above $5,000" },
];

const AllCategories = () => {
  // State management
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortBy, setSortBy] = useState("name-asc");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Filters
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>("");
  const [ratingFilter, setRatingFilter] = useState<number>(0);
  const [isPremium, setIsPremium] = useState<boolean | undefined>(undefined);
  const [isRepairingService, setIsRepairingService] = useState<
    boolean | undefined
  >(undefined);
  const [isShowHome, setIsShowHome] = useState<boolean | undefined>(undefined);

  // Search suggestions (for demonstration)
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const router = useRouter();

  const { data: categoriesResponse, isLoading } = useCategories({
    page: currentPage,
    limit: itemsPerPage,
    sortBy: sortBy.split("-")[0],
    sortOrder: sortBy.split("-")[1] as "asc" | "desc",
    isActive: true,
    search: searchTerm || undefined,
    isPremium,
    isRepairingService,
    isShowHome,
  });

  // Get data from API response
  const currentCategories = categoriesResponse?.data || [];
  const pagination = categoriesResponse?.pagination;
  const totalItems = pagination?.total_items || 0;
  const totalPages = pagination?.total_pages || 0;

  // Server-side pagination through API

  // Reset page when search or filters change
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [searchTerm, sortBy, itemsPerPage, currentPage]);

  // Handlers
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setShowSuggestions(value.length > 0);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 300, behavior: "smooth" });
    }
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    setCurrentPage(1); // Reset to first page when sorting changes
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value));
  };

  const handleTypeToggle = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setSelectedTypes([]);
    setSelectedPriceRange("");
    setRatingFilter(0);
    setSortBy("name-asc");
    setIsPremium(undefined);
    setIsRepairingService(undefined);
    setIsShowHome(undefined);
  };

  const activeFiltersCount =
    (searchTerm ? 1 : 0) +
    selectedTypes.length +
    (selectedPriceRange ? 1 : 0) +
    (ratingFilter > 0 ? 1 : 0) +
    (isPremium !== undefined ? 1 : 0) +
    (isRepairingService !== undefined ? 1 : 0) +
    (isShowHome !== undefined ? 1 : 0);

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
            <Typography variant="Bold_H1" className="text-5xl mb-6 text-white">
              All Services
            </Typography>
            <Typography
              variant="Regular_H4"
              className="text-xl text-white/90 mb-8"
            >
              Explore our comprehensive range of professional glass solutions
              and services
            </Typography>

            {/* Enhanced Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search services, categories, or keywords..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
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

              {/* Search Suggestions Dropdown */}
              {showSuggestions && searchFocused && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl z-50 p-4 text-left">
                  <Typography
                    variant="Regular_H6"
                    className="text-gray-500 mb-2"
                  >
                    Popular searches
                  </Typography>
                  <div className="space-y-2">
                    {[
                      "Window Glass",
                      "Mirror Installation",
                      "Shower Doors",
                      "Glass Repair",
                    ].map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => handleSearch(suggestion.toLowerCase())}
                        className="block w-full text-left px-3 py-2 rounded hover:bg-gray-100 text-gray-700"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Filters and Controls Bar */}
      <section className="sticky top-0 z-40 bg-background border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Left side - Results count and filters */}
            <div className="flex flex-wrap  gap-4">
              <Typography
                variant="Regular_H5"
                className="text-muted-foreground"
              >
                {totalItems} {totalItems === 1 ? "Result" : "Results"}
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

                {/* Repairing Service Filter */}
                <div className="flex flex-col gap-1">
                  <Label className="text-xs text-muted-foreground font-medium">
                    Service Type
                  </Label>
                  <Select
                    value={
                      isRepairingService === undefined
                        ? "all"
                        : isRepairingService.toString()
                    }
                    onValueChange={(val) =>
                      setIsRepairingService(
                        val === "all" ? undefined : val === "true"
                      )
                    }
                  >
                    <SelectTrigger className="w-40 h-9">
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="true">Repairing Only</SelectItem>
                      <SelectItem value="false">Non-Repairing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Show Home Filter */}
                <div className="flex flex-col gap-1">
                  <Label className="text-xs text-muted-foreground font-medium">
                    Featured
                  </Label>
                  <Select
                    value={
                      isShowHome === undefined ? "all" : isShowHome.toString()
                    }
                    onValueChange={(val) =>
                      setIsShowHome(val === "all" ? undefined : val === "true")
                    }
                  >
                    <SelectTrigger className="w-36 h-9">
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="true">Featured</SelectItem>
                      <SelectItem value="false">Not Featured</SelectItem>
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

            {/* Right side - View options and sorting */}
            <div className="flex items-center gap-3">
              {/* View Mode Toggle */}
              <div className="flex items-center rounded-lg border">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className={cn(
                    "rounded-r-none h-9",
                    viewMode === "grid" &&
                      "gradient-primary text-white border-0"
                  )}
                >
                  <Grid3x3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className={cn(
                    "rounded-l-none h-9",
                    viewMode === "list" &&
                      "gradient-primary text-white border-0"
                  )}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>

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
            {/* Categories Grid/List */}
            <div className="flex-1">
              {isLoading ? (
                <div
                  className={
                    viewMode === "grid"
                      ? "grid md:grid-cols-2 xl:grid-cols-4 gap-6"
                      : "space-y-4"
                  }
                >
                  {Array.from({ length: itemsPerPage }).map((_, index) => (
                    <div
                      key={index}
                      className={
                        viewMode === "grid"
                          ? "h-96 bg-muted/20 animate-pulse rounded-lg"
                          : "h-32 bg-muted/20 animate-pulse rounded-lg"
                      }
                    />
                  ))}
                </div>
              ) : currentCategories.length > 0 ? (
                <>
                  <div
                    className={
                      viewMode === "grid"
                        ? "grid md:grid-cols-2 xl:grid-cols-4 gap-6"
                        : "space-y-4"
                    }
                  >
                    {currentCategories.map((category: Category) =>
                      viewMode === "grid" ? (
                        <ServiceCategoryCard
                          key={category.id}
                          category={category}
                          onExplore={() => {
                            router.push(`/all-categories/${category.id}`);
                          }}
                        />
                      ) : (
                        // List view card
                        <div
                          key={category.id}
                          className="bg-card rounded-lg p-6 border hover:shadow-lg transition-shadow"
                        >
                          <div className="flex gap-6">
                            <img
                              src={
                                category.cardImage?.url || "/placeholder.jpg"
                              }
                              alt={category.name}
                              className="w-32 h-32 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                              <Typography variant="Bold_H4" className="mb-2">
                                {category.name}
                              </Typography>
                              <Typography
                                variant="Regular_H6"
                                className="text-muted-foreground mb-4"
                              >
                                {category.description}
                              </Typography>
                              <Button
                                onClick={() =>
                                  (window.location.href = `/all-categories/${category.id}`)
                                }
                                className="gradient-primary text-white border-0"
                              >
                                View Details
                              </Button>
                            </div>
                          </div>
                        </div>
                      )
                    )}
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
                      : "No services available at the moment."}
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
    </div>
  );
};

export default AllCategories;
