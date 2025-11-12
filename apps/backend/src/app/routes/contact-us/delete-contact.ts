import express from "express";
import httpStatus from "http-status";
import { db } from "../../db";
import { auth } from "../../middlewares/auth";
import { catchAsync, sendApiResponse } from "../../utils";
import AppError from "../../classes/AppError";

/**
 * DELETE /contact-us/:id - Delete a contact inquiry (Admin/Super Admin only)
 * Allows administrators to permanently delete contact inquiries
 */
export const deleteContactRoute = express.Router();

// Export the handler function for use in the router
export const deleteContact = deleteContactRoute;

deleteContactRoute.delete(
  "/:id",
  auth(["admin", "superadmin"]),
  catchAsync(async (req, res, next) => {
    const { id } = req.params;

    if (!id) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Contact inquiry ID is required",
      );
    }

    // Check if the contact inquiry exists
    const existingContact = await db.contactUs.findUnique({
      where: { id },
    });

    if (!existingContact) {
      throw new AppError(httpStatus.NOT_FOUND, "Contact inquiry not found");
    }

    // Delete the contact inquiry
    await db.contactUs.delete({
      where: { id },
    });

    return sendApiResponse(res, {
      status: httpStatus.OK,
      success: true,
      message: "Contact inquiry deleted successfully",
      data: {
        id: existingContact.id,
        deletedAt: new Date(),
      },
    });
  }),
);
