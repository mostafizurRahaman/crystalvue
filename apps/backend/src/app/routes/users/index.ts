import express from "express";
import { getMe } from "./get-me";
import { createUserRoute } from "./create-user";
import { updateUserRoute } from "./update-user";
import { updateMeRoute } from "./update-me";
import { deleteUserRoute } from "./delete-user";
import { getAllUsersRoute } from "./get-all-users";
import { getUserDetailsRoute } from "./get-user-details";
import { auth } from "../../middlewares/auth";

export const userRouter = express.Router();

// GET /users/get-me - Get current user info (authenticated users)
userRouter.use("/get-me", auth(["admin", "superadmin", "user"]), getMe);

// PUT /users/update-me - Update current user's profile (authenticated users)
userRouter.use(
  "/update-me",
  auth(["admin", "superadmin", "user"]),
  updateMeRoute
);

// GET /users - Get all users (Super Admin only)
userRouter.get("/", getAllUsersRoute);

// POST /users - Create new user (Super Admin only)
userRouter.post("/", createUserRoute);

// GET /users/:id - Get user details (Super Admin only)
userRouter.get("/:id", getUserDetailsRoute);

// PUT /users/:id - Update user (Super Admin only)
userRouter.put("/:id", updateUserRoute);

// DELETE /users/:id - Delete user (Super Admin only)
userRouter.delete("/:id", deleteUserRoute);

// Export individual routes for use in testing or modular importing
export {
  getMe,
  createUserRoute,
  updateUserRoute,
  updateMeRoute,
  deleteUserRoute,
  getAllUsersRoute,
  getUserDetailsRoute,
};
