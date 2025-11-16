"use client";

import { AboutPageForm } from "../settings/_components/about-page-form";
import { CompanyStoryForm } from "../settings/_components/company-story-form";
import { AboutBlocksForm } from "../settings/_components/about-blocks-form";
import { Typography } from "@/components/typography";
import { Separator } from "@/components/ui/separator";

export default function AboutUsPage() {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="space-y-2">
        <Typography variant="Bold_H3" className="text-foreground">
          About Us Page Management
        </Typography>
        <Typography variant="Regular_H7" className="text-muted-foreground">
          Manage the about us page content, company story, and vision/mission
          blocks
        </Typography>
      </div>

      <Separator />

      <div className="space-y-8">
        <AboutPageForm />

        <CompanyStoryForm />

        <AboutBlocksForm />
      </div>
    </div>
  );
}
