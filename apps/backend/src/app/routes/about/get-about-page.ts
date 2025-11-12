import express from "express";
import httpStatus from "http-status";
import { db } from "../../db";
import { catchAsync, sendApiResponse } from "../../utils";

/**
 * GET /about - Get complete about page data (Public access)
 * Returns about page configuration, company story, and vision/mission blocks
 */
export const getAboutPageRoute = express.Router();

getAboutPageRoute.get(
  "/",
  catchAsync(async (req, res) => {
    // Get the about page configuration (should always be id: 1)
    let aboutPage = await db.aboutPage.findUnique({
      where: { id: 1 },
      include: {
        bannerImage: {
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
        companyStory: {
          include: {
            leftImage: {
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
        },
        visionBlock: {
          include: {
            image: {
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
        },
        missionBlock: {
          include: {
            image: {
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
        },
      },
    });

    // Create about page if it doesn't exist
    if (!aboutPage) {
      aboutPage = await db.aboutPage.create({
        data: {
          id: 1,
          introTitle: "About Our Company",
          introSubtitle: "Professional Glass & Aluminium Solutions",
          heroText:
            "We are a professional installation team dedicated to quality craftsmanship.",
          isActive: true,
        },
        include: {
          bannerImage: {
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
          companyStory: {
            include: {
              leftImage: {
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
          },
          visionBlock: {
            include: {
              image: {
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
          },
          missionBlock: {
            include: {
              image: {
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
          },
        },
      });
    }

    // Create company story if it doesn't exist
    if (!aboutPage?.companyStory) {
      aboutPage = await db.aboutPage.update({
        where: { id: 1 },
        data: {
          companyStory: {
            create: {
              title: "Our Story",
              content:
                "Founded with a vision to transform spaces with premium glass and aluminium solutions.",
              isActive: true,
            },
          },
        },
        include: {
          bannerImage: true,
          companyStory: {
            include: {
              leftImage: true,
            },
          },
          visionBlock: {
            include: {
              image: true,
            },
          },
          missionBlock: {
            include: {
              image: true,
            },
          },
        },
      });
    }

    // Create vision block if it doesn't exist
    if (!aboutPage?.visionBlock) {
      aboutPage = await db.aboutPage.update({
        where: { id: 1 },
        data: {
          visionBlock: {
            create: {
              type: "VISION",
              title: "Our Vision",
              content:
                "To be the leading provider of innovative glass and aluminium solutions, transforming spaces with exceptional craftsmanship.",
              isActive: true,
            },
          },
        },
        include: {
          bannerImage: true,
          companyStory: {
            include: {
              leftImage: true,
            },
          },
          visionBlock: {
            include: {
              image: true,
            },
          },
          missionBlock: {
            include: {
              image: true,
            },
          },
        },
      });
    }

    // Create mission block if it doesn't exist
    if (!aboutPage?.missionBlock) {
      aboutPage = await db.aboutPage.update({
        where: { id: 1 },
        data: {
          missionBlock: {
            create: {
              type: "MISSION",
              title: "Our Mission",
              content:
                "To deliver superior quality glass and aluminium installations that exceed client expectations through innovation, craftsmanship, and exceptional service.",
              isActive: true,
            },
          },
        },
        include: {
          bannerImage: true,
          companyStory: {
            include: {
              leftImage: true,
            },
          },
          visionBlock: {
            include: {
              image: true,
            },
          },
          missionBlock: {
            include: {
              image: true,
            },
          },
        },
      });
    }

    sendApiResponse(res, {
      status: httpStatus.OK,
      success: true,
      message: "About page data retrieved successfully",
      data: aboutPage,
    });
  }),
);
