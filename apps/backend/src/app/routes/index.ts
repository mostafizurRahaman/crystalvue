import express from "express";
import { authRouter } from "./auth";
import { userRouter } from "./users";
import { heroSliderRoutes } from "./sliders";
import { categoriesRouter } from "./categories";
import { categoryAddOnsRouter } from "./category-add-ons";
import { servicesRouter } from "./services";
import { servicesAddOnRouter } from "./services-add-on";
import { contactUsRouter } from "./contact-us";
import { testimonialsRouter } from "./testimonials";
import { galleryRouter } from "./gallery";
import { aboutRouter } from "./about";
import { settingsRouter } from "./settings";
import { dashboardRouter } from "./dashboard";
import { uploadRoutes } from "./uploads/delete-image";

export const allRoutes = express.Router();

const routes = [
  {
    path: "/auth",
    route: authRouter,
  },
  {
    path: "/users",
    route: userRouter,
  },
  {
    path: "/sliders",
    route: heroSliderRoutes,
  },
  {
    path: "/categories",
    route: categoriesRouter,
  },
  {
    path: "/categories/addons",
    route: categoryAddOnsRouter,
  },
  {
    path: "/services",
    route: servicesRouter,
  },
  {
    path: "/services/addons",
    route: servicesAddOnRouter,
  },
  {
    path: "/testimonials",
    route: testimonialsRouter,
  },
  {
    path: "/gallery",
    route: galleryRouter,
  },
  {
    path: "/about",
    route: aboutRouter,
  },
  {
    path: "/settings",
    route: settingsRouter,
  },
  {
    path: "/dashboard",
    route: dashboardRouter,
  },
  {
    path: "/contact-us",
    route: contactUsRouter,
  },
  {
    path: "/uploads",
    route: uploadRoutes,
  },
];

routes.forEach((route) => {
  allRoutes.use(route.path, route.route);
});
