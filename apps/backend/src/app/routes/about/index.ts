import express from "express";
import { getAboutPageRoute } from "./get-about-page";
import { updateAboutPageRoute } from "./update-about-page";
import { getCompanyStoryRoute } from "./get-company-story";
import { updateCompanyStoryRoute } from "./update-company-story";
import { getAboutBlocksRoute } from "./get-about-blocks";
import { updateAboutBlocksRoute } from "./update-about-blocks";
import { auth } from "../../middlewares/auth";

export const aboutRouter = express.Router();

// GET /about - Get complete about page data (public access)
aboutRouter.use("/", getAboutPageRoute);

// PUT /about - Update about page (admin/superadmin only)
aboutRouter.use("/", updateAboutPageRoute);

// GET /about/story - Get company story (public access)
aboutRouter.use("/story", getCompanyStoryRoute);

// PUT /about/story - Update company story (admin/superadmin only)
aboutRouter.use("/story", updateCompanyStoryRoute);

// GET /about/blocks - Get vision and mission blocks (public access)
aboutRouter.use("/blocks", getAboutBlocksRoute);

// PUT /about/blocks - Update vision and mission blocks (admin/superadmin only)
aboutRouter.use("/blocks", updateAboutBlocksRoute);

// Export individual routes for potential individual use
export {
  getAboutPageRoute,
  updateAboutPageRoute,
  getCompanyStoryRoute,
  updateCompanyStoryRoute,
  getAboutBlocksRoute,
  updateAboutBlocksRoute,
};
