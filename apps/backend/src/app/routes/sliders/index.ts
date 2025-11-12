import express from "express";
import createSliderRoute from "./create-slider";
import getAllSlidersRoute from "./get-all-sliders";
import getSliderRoute from "./get-slider";
import updateSliderRoute from "./update-slider";
import deleteSliderRoute from "./delete-slider";
import reorderSlidersRoute from "./reorder-sliders";
import bulkDeleteSlidersRoute from "./bulk-delete-sliders";
import getSlidersBatchRoute from "./get-sliders-batch";

export const heroSliderRoutes = express.Router();

// Hero slider routes:
heroSliderRoutes.use("/create", createSliderRoute); // POST /
heroSliderRoutes.use("/get-all", getAllSlidersRoute); // GET /
heroSliderRoutes.use("/", getSlidersBatchRoute); // GET /batch, POST /batch
heroSliderRoutes.use("/", getSliderRoute); // GET /:id
heroSliderRoutes.use("/", updateSliderRoute); // PUT /:id
heroSliderRoutes.use("/", deleteSliderRoute); // DELETE /:id
heroSliderRoutes.use("/", reorderSlidersRoute); // PUT /reorder
heroSliderRoutes.use("/", bulkDeleteSlidersRoute); // POST /bulk-delete
