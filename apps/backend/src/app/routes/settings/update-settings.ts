import express from "express";
import httpStatus from "http-status";
import { db } from "../../db";
import { auth } from "../../middlewares/auth";
import { catchAsync, sendApiResponse } from "../../utils";
import AppError from "../../classes/AppError";
import { validateZodSchema } from "../../middlewares/validate-schema";
import { deleteFromCloudinaryByPublicId } from "../../utils/delete-image-by-public-id";
import { updateSettingsSchema } from "../../schemas/settings";

/**
 * PUT /settings - Update global settings (Admin/Super Admin only)
 * Handles atomic updates with optional image replacements
 */
export const updateSettingsRoute = express.Router();

updateSettingsRoute.put(
  "/",
  auth(["admin", "superadmin"]),
  validateZodSchema({ body: updateSettingsSchema }),
  catchAsync(async (req, res, next) => {
    const updateData = req.body;

    // Get existing settings first
    const existingSettings = await db.globalSettings.findUnique({
      where: { id: 1 },
      include: {
        logoImage: true,
        faviconImage: true,
        metaImage: true,
      },
    });

    // Handle Cloudinary deletions outside the transaction
    const cloudinaryDeletions: any[] = [];
    
    // Delete old images from Cloudinary if new ones are provided
    if (updateData.logoImage && existingSettings?.logoImage) {
      try {
        const logoResult = await deleteFromCloudinaryByPublicId(
          existingSettings.logoImage.publicId,
          "image",
        );
        cloudinaryDeletions.push({ type: "logo", result: logoResult });
        console.log(
          `Successfully deleted logo image: ${existingSettings.logoImage.publicId}`,
        );
      } catch (cloudinaryError) {
        throw new AppError(
          httpStatus.INTERNAL_SERVER_ERROR,
          `Failed to delete logo image from Cloudinary: ${cloudinaryError instanceof Error ? cloudinaryError.message : "Unknown error"}`,
        );
      }
    }

    if (updateData.faviconImage && existingSettings?.faviconImage) {
      try {
        const faviconResult = await deleteFromCloudinaryByPublicId(
          existingSettings.faviconImage.publicId,
          "image",
        );
        cloudinaryDeletions.push({
          type: "favicon",
          result: faviconResult,
        });
        console.log(
          `Successfully deleted favicon image: ${existingSettings.faviconImage.publicId}`,
        );
      } catch (cloudinaryError) {
        throw new AppError(
          httpStatus.INTERNAL_SERVER_ERROR,
          `Failed to delete favicon image from Cloudinary: ${cloudinaryError instanceof Error ? cloudinaryError.message : "Unknown error"}`,
        );
      }
    }

    if (updateData.metaImage && existingSettings?.metaImage) {
      try {
        const metaResult = await deleteFromCloudinaryByPublicId(
          existingSettings.metaImage.publicId,
          "image",
        );
        cloudinaryDeletions.push({ type: "meta", result: metaResult });
        console.log(
          `Successfully deleted meta image: ${existingSettings.metaImage.publicId}`,
        );
      } catch (cloudinaryError) {
        throw new AppError(
          httpStatus.INTERNAL_SERVER_ERROR,
          `Failed to delete meta image from Cloudinary: ${cloudinaryError instanceof Error ? cloudinaryError.message : "Unknown error"}`,
        );
      }
    }

    // Use transaction with increased timeout to avoid timeout issues
    const result = await db.$transaction(
      async (tx) => {
      let newLogoImage = null;
      let newFaviconImage = null;
      let newMetaImage = null;

      // Handle logo image replacement (only database operations)
      if (updateData.logoImage) {
        if (existingSettings?.logoImage) {
          await tx.image.delete({
            where: { id: existingSettings.logoImage.id },
          });
        }

        newLogoImage = await tx.image.create({
          data: {
            url: updateData.logoImage.url,
            publicId: updateData.logoImage.publicId,
            folder: updateData.logoImage.folder || "app/settings",
            altText: updateData.logoImage.altText || "Company logo",
            width: updateData.logoImage.width,
            height: updateData.logoImage.height,
            format: updateData.logoImage.format,
            size: updateData.logoImage.size,
          },
        });
      }

      // Handle favicon image replacement (only database operations)
      if (updateData.faviconImage) {
        if (existingSettings?.faviconImage) {
          await tx.image.delete({
            where: { id: existingSettings.faviconImage.id },
          });
        }

        newFaviconImage = await tx.image.create({
          data: {
            url: updateData.faviconImage.url,
            publicId: updateData.faviconImage.publicId,
            folder: updateData.faviconImage.folder || "app/settings",
            altText: updateData.faviconImage.altText || "Company favicon",
            width: updateData.faviconImage.width,
            height: updateData.faviconImage.height,
            format: updateData.faviconImage.format,
            size: updateData.faviconImage.size,
          },
        });
      }

      // Handle meta image replacement (only database operations)
      if (updateData.metaImage) {
        if (existingSettings?.metaImage) {
          await tx.image.delete({
            where: { id: existingSettings.metaImage.id },
          });
        }

        newMetaImage = await tx.image.create({
          data: {
            url: updateData.metaImage.url,
            publicId: updateData.metaImage.publicId,
            folder: updateData.metaImage.folder || "app/settings",
            altText: updateData.metaImage.altText || "Site meta image",
            width: updateData.metaImage.width,
            height: updateData.metaImage.height,
            format: updateData.metaImage.format,
            size: updateData.metaImage.size,
          },
        });
      }

      // Update the settings
      return await tx.globalSettings.upsert({
        where: { id: 1 },
        update: {
          siteTitle: updateData.siteTitle,
          siteDescription: updateData.siteDescription,
          logoImageId: newLogoImage?.id,
          faviconImageId: newFaviconImage?.id,
          metaImageId: newMetaImage?.id,
          contactEmail: updateData.contactEmail,
          contactPhone: updateData.contactPhone,
          contactWhatsApp: updateData.contactWhatsApp,
          officeAddress: updateData.officeAddress,
          googleMapEmbedCode: updateData.googleMapEmbedCode,
          socialMediaLinks: updateData.socialMediaLinks,
          businessHours: updateData.businessHours,
          seoMetaTitle: updateData.seoMetaTitle,
          seoMetaDescription: updateData.seoMetaDescription,
          seoKeywords: updateData.seoKeywords,
          isActive: updateData.isActive,
        },
        create: {
          id: 1,
          siteTitle: updateData.siteTitle,
          siteDescription: updateData.siteDescription,
          logoImageId: newLogoImage?.id,
          faviconImageId: newFaviconImage?.id,
          metaImageId: newMetaImage?.id,
          contactEmail: updateData.contactEmail,
          contactPhone: updateData.contactPhone,
          contactWhatsApp: updateData.contactWhatsApp,
          officeAddress: updateData.officeAddress,
          googleMapEmbedCode: updateData.googleMapEmbedCode,
          socialMediaLinks: updateData.socialMediaLinks,
          businessHours: updateData.businessHours,
          seoMetaTitle: updateData.seoMetaTitle,
          seoMetaDescription: updateData.seoMetaDescription,
          seoKeywords: updateData.seoKeywords,
          isActive: updateData.isActive ?? true,
        },
        include: {
          logoImage: {
            select: {
              id: true,
              url: true,
              publicId: true,
              altText: true,
              width: true,
              height: true,
              format: true,
            },
          },
          faviconImage: {
            select: {
              id: true,
              url: true,
              publicId: true,
              altText: true,
              width: true,
              height: true,
              format: true,
            },
          },
          metaImage: {
            select: {
              id: true,
              url: true,
              publicId: true,
              altText: true,
              width: true,
              height: true,
              format: true,
            },
          },
        },
      });
      },
      { timeout: 10000 } // Increase timeout to 10 seconds
    );

    sendApiResponse(res, {
      status: httpStatus.OK,
      success: true,
      message: "Global settings updated atomically with image management",
      data: result,
    });
  }),
);
