import express from "express";
import { auth } from "../../middlewares/auth";
import {
  getOverviewStats,
  getContactTrends,
  getContactStatusDistribution,
  getCategoryPerformance,
  getRatingDistribution,
  getRecentActivity,
  getGalleryCategories,
} from "./stats";

export const dashboardRouter = express.Router();

dashboardRouter.get("/overview", auth(["admin", "superadmin"]), getOverviewStats);
dashboardRouter.get("/contact-trends", auth(["admin", "superadmin"]), getContactTrends);
dashboardRouter.get("/contact-status", auth(["admin", "superadmin"]), getContactStatusDistribution);
dashboardRouter.get("/category-performance", auth(["admin", "superadmin"]), getCategoryPerformance);
dashboardRouter.get("/rating-distribution", auth(["admin", "superadmin"]), getRatingDistribution);
dashboardRouter.get("/recent-activity", auth(["admin", "superadmin"]), getRecentActivity);
dashboardRouter.get("/gallery-categories", auth(["admin", "superadmin"]), getGalleryCategories);
