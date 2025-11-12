import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import { db } from "../../db";
import { catchAsync, sendApiResponse } from "../../utils";
import AppError from "../../classes/AppError";
import type {
  UpdateContactStatusParamsType,
  UpdateContactStatusType,
} from "../../schemas/contact-us";
import { auth } from "../../middlewares/auth";

/**
 * Controller for updating contact entry status
 * Supports status change with optional reason and admin notes
 * Only accessible by admin/superadmin users
 */
export const updateContactStatus = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params as UpdateContactStatusParamsType;
    const data = req.body as UpdateContactStatusType;

    // Validate that contact exists
    const contact = await db.contactUs.findUnique({
      where: { id },
      include: {
        parentCategory: {
          select: { id: true, name: true },
        },
        service: {
          select: { id: true, name: true },
        },
      },
    });

    if (!contact) {
      throw new AppError(httpStatus.NOT_FOUND, "Contact entry not found");
    }

    // Validate status transition logic
    const statusTransitions = {
      READY: ["PENDING", "APPROVED", "REJECTED"],
      PENDING: ["READY", "APPROVED", "REJECTED"],
      APPROVED: ["REJECTED"],
      REJECTED: ["PENDING"],
    };

    const currentStatus = contact.status;
    const newStatus = data.status;

    if (!statusTransitions[currentStatus].includes(newStatus)) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `Invalid status transition: Cannot change from ${currentStatus} to ${newStatus}`,
      );
    }

    // If rejected, reason is required (already validated in schema, but double-check)
    if (newStatus === "REJECTED" && !data.reason) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Reason is required when status is REJECTED",
      );
    }

    // Update the contact status
    const updatedContact = await db.contactUs.update({
      where: { id },
      data: {
        status: newStatus,
        // Add reason and admin notes as JSON in message field or create a new table for status history
        // For now, we'll enhance the message with status change info
        message:
          contact.message +
          `\n\n[Status Updated]\nPrevious Status: ${currentStatus}\nNew Status: ${newStatus}` +
          (data.reason ? `\nReason: ${data.reason}` : "") +
          (data.adminNotes ? `\n\nAdmin Notes: ${data.adminNotes}` : ""),
        updatedAt: new Date(),
      },
      include: {
        parentCategory: {
          select: {
            id: true,
            name: true,
          },
        },
        service: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Optionally, create status change log
    // This is a simple enhancement - you could create a separate status history table for more comprehensive tracking

    sendApiResponse(res, {
      status: httpStatus.OK,
      success: true,
      message: `Contact status changed from ${currentStatus} to ${newStatus}`,
      data: updatedContact,
    });
  },
);

export default updateContactStatus;
