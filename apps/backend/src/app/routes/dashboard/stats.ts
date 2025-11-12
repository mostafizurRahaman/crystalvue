
import httpStatus from "http-status";
import { catchAsync, sendApiResponse } from "../../utils";
import { db } from "../../db";
import { auth } from "../../middlewares/auth";

/**
 * GET /dashboard/overview - Get dashboard overview statistics
 */
export const getOverviewStats = catchAsync(async (req, res) => {
  // Get current and previous month dates
  const now = new Date();
  const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  // Get total contacts
  const totalContacts = await db.contactUs.count();

  // Get pending contacts
  const pendingContacts = await db.contactUs.count({
    where: { status: "PENDING" },
  });

  // Get this month and last month contacts
  const thisMonthContacts = await db.contactUs.count({
    where: {
      createdAt: {
        gte: currentMonth,
        lt: nextMonth,
      },
    },
  });

  const lastMonthContacts = await db.contactUs.count({
    where: {
      createdAt: {
        gte: lastMonth,
        lt: currentMonth,
      },
    },
  });

  // Get active categories and services
  const activeCategories = await db.category.count({
    where: { isActive: true },
  });

  const activeServices = await db.service.count({
    where: { isActive: true },
  });

  // Get average rating from testimonials
  const ratingsData = await db.testimonial.findMany({
    where: { isActive: true },
    select: { rating: true },
  });

  const avgRating =
    ratingsData.length > 0
      ? ratingsData.reduce((sum, item) => sum + item.rating, 0) / ratingsData.length
      : 0;

  // Get new users this month
  const newUsers = await db.user.count({
    where: {
      createdAt: {
        gte: currentMonth,
        lt: nextMonth,
      },
    },
  });

  // Get total users
  const totalUsers = await db.user.count();

  const overviewStats = {
    totalContacts,
    pendingContacts,
    thisMonthContacts,
    lastMonthContacts,
    contactGrowth: thisMonthContacts > 0 && lastMonthContacts > 0
      ? ((thisMonthContacts - lastMonthContacts) / lastMonthContacts) * 100
      : 0,
    activeCategories,
    activeServices,
    avgRating: Math.round(avgRating * 10) / 10, // Round to 1 decimal place
    newUsers,
    totalUsers,
  };

  sendApiResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "Overview statistics retrieved successfully",
    data: overviewStats,
  });
});

/**
 * GET /dashboard/contact-trends - Get contact inquiry trends over months
 */
export const getContactTrends = catchAsync(async (req, res) => {
  // Get last 12 months of contact data
  const now = new Date();
  const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1);

  const monthlyContacts = await db.contactUs.groupBy({
    by: ['createdAt'],
    where: {
      createdAt: {
        gte: twelveMonthsAgo,
        lte: now,
      },
    },
    _count: {
      id: true,
    },
  });

  // Group by month
  const monthlyMap = new Map<string, number>();
  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  // Initialize all months with 0
  for (let i = 11; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthKey = monthNames[date.getMonth()];
    if (monthKey) {
      monthlyMap.set(monthKey, 0);
    }
  }

  // Count contacts by month
  monthlyContacts.forEach((contact) => {
    const date = new Date(contact.createdAt);
    const monthKey = monthNames[date.getMonth()];
    const key = monthKey;
    
    if (key && monthlyMap.has(key)) {
      monthlyMap.set(key, (monthlyMap.get(key) || 0) + contact._count.id);
    }
  });

  // Convert to array format
  const trends = Array.from(monthlyMap.entries()).map(([month, count]) => ({
    month,
    count,
  }));

  sendApiResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "Contact trends retrieved successfully", 
    data: trends,
  });
});

/**
 * GET /dashboard/contact-status - Get contact status distribution
 */
export const getContactStatusDistribution = catchAsync(async (req, res) => {
  const statusCounts = await db.contactUs.groupBy({
    by: ['status'],
    _count: {
      id: true,
    },
  });

  const distribution = statusCounts.reduce((acc, item) => {
    acc[item.status] = item._count.id;
    return acc;
  }, {} as Record<string, number>);

  sendApiResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "Contact status distribution retrieved successfully",
    data: distribution,
  });
});

/**
 * GET /dashboard/category-performance - Get category performance by inquiries
 */
export const getCategoryPerformance = catchAsync(async (req, res) => {
  const categoryInquiries = await db.contactUs.groupBy({
    by: ['parentCategoryId'],
    _count: {
      id: true,
    },
  });

  // Get category names
  const categoryIds = categoryInquiries.map(item => item.parentCategoryId);
  const categories = await db.category.findMany({
    where: {
      id: { in: categoryIds },
    },
    select: {
      id: true,
      name: true,
    },
  });

  // Merge data
  const performance = categoryInquiries.map(item => {
    const category = categories.find(cat => cat.id === item.parentCategoryId);
    return {
      name: category?.name || "Unknown",
      inquiries: item._count.id,
      categoryId: item.parentCategoryId,
    };
  }).sort((a, b) => b.inquiries - a.inquiries);

  sendApiResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "Category performance retrieved successfully",
    data: { categories: performance },
  });
});

/**
 * GET /dashboard/rating-distribution - Get testimonial ratings distribution
 */
export const getRatingDistribution = catchAsync(async (req, res) => {
  const ratingCounts = await db.testimonial.groupBy({
    by: ['rating'],
    where: { isActive: true },
    _count: {
      id: true,
    },
  });

  const distribution = ratingCounts.reduce((acc, item) => {
    acc[item.rating.toString()] = item._count.id;
    return acc;
  }, {} as Record<string, number>);

  // Ensure all ratings 1-5 are present
  for (let i = 1; i <= 5; i++) {
    if (!distribution[i.toString()]) {
      distribution[i.toString()] = 0;
    }
  }

  sendApiResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "Rating distribution retrieved successfully",
    data: distribution,
  });
});

/**
 * GET /dashboard/recent-activity - Get recent contact activity
 */
export const getRecentActivity = catchAsync(async (req, res) => {
  const limit = 10; // Get last 10 contacts

  const recentContacts = await db.contactUs.findMany({
    take: limit,
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      fullName: true,
      email: true,
      status: true,
      createdAt: true,
      parentCategory: {
        select: {
          name: true,
        },
      },
      service: {
        select: {
          name: true,
        },
      },
    },
  });

  sendApiResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "Recent activity retrieved successfully",
    data: { contacts: recentContacts },
  });
});

/**
 * GET /dashboard/gallery-categories - Get gallery category distribution
 */
export const getGalleryCategories = catchAsync(async (req, res) => {
  const galleryCounts = await db.gallery.groupBy({
    by: ['galleryCategory'],
    where: { isActive: true },
    _count: {
      id: true,
    },
  });

  const categoryNames = {
    SHOWER_ENCLOSURES: "Shower Enclosures",
    GLASS_DOORS: "Glass Doors",
    RAILINGS: "Railings",
    WINDOWS: "Windows",
    UPVC: "UPVC",
  };

  const distribution = galleryCounts.reduce((acc, item) => {
    const key = item.galleryCategory || "NOT_CATEGORIZED";
    acc[key] = item._count.id;
    return acc;
  }, {} as Record<string, number>);

  // Map to readable category names
  const mappedDistribution = Object.entries(distribution).reduce((acc, [key, count]) => {
    const readableName = categoryNames[key as keyof typeof categoryNames] || 
      key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    acc[readableName] = count;
    return acc;
  }, {} as Record<string, number>);

  sendApiResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "Gallery categories retrieved successfully",
    data: mappedDistribution,
  });
});
