import express from "express";
import { getSettingsRoute } from "./get-settings";
import { postSettingsRoute } from "./post-settings";
import { updateSettingsRoute } from "./update-settings";

export const settingsRouter = express.Router();

// GET /settings - Get global settings (public access)
settingsRouter.use("/", getSettingsRoute);

// POST /settings - Create initial global settings (admin/superadmin only)
settingsRouter.use("/", postSettingsRoute);

// PUT /settings - Update global settings (admin/superadmin only)
settingsRouter.use("/", updateSettingsRoute);

// Export individual routes for potential individual use
export { getSettingsRoute, postSettingsRoute, updateSettingsRoute };
