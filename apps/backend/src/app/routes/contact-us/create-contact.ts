import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import { db } from "../../db";
import { catchAsync, sendApiResponse } from "../../utils";
import AppError from "../../classes/AppError";
import type { CreateContactUsType } from "../../schemas/contact-us";

/**
 * Controller for creating a new contact us entry
 * Validates input, checks category and service existence, and returns 201 on success
 */
export const createContact = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = req.body as CreateContactUsType;

    // Validate that category exists
    const category = await db.category.findUnique({
      where: { id: data.parentCategoryId },
      select: { id: true, name: true, isActive: true },
    });

    if (!category) {
      throw new AppError(httpStatus.NOT_FOUND, "Category not found");
    }

    if (!category.isActive) {
      throw new AppError(httpStatus.BAD_REQUEST, "Category is not active");
    }

    // Validate that service exists and belongs to the category
    const service = await db.service.findUnique({
      where: {
        id: data.serviceId,
        parentCategoryId: data.parentCategoryId,
      },
      select: { id: true, name: true, isActive: true },
    });

    if (!service) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        "Service not found in this category",
      );
    }

    if (!service.isActive) {
      throw new AppError(httpStatus.BAD_REQUEST, "Service is not active");
    }

    // Create the contact entry with relations
    const contact = await db.contactUs.create({
      data: {
        fullName: data.fullName,
        phoneNumber: data.phoneNumber,
        email: data.email || null,
        address: data.address,
        parentCategoryId: data.parentCategoryId,
        serviceId: data.serviceId,
        status: data.status,
        images: data.images || [],
        message: data.message,
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

    sendApiResponse(res, {
      status: httpStatus.CREATED,
      success: true,
      message: "Contact form submitted successfully",
      data: contact,
    });
  },
);

export default createContact;
