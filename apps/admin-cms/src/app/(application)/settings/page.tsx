"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Typography } from "@/components/typography";
import { SettingsForm } from "./_components/settings-form";
import { AboutPageForm } from "./_components/about-page-form";
import { CompanyStoryForm } from "./_components/company-story-form";
import { AboutBlocksForm } from "./_components/about-blocks-form";
import { 
  SettingsFormSkeleton, 
  AboutPageFormSkeleton, 
  CompanyStoryFormSkeleton,
  AboutBlocksFormSkeleton 
} from "./_components";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");

  return (
    <div className="container mx-auto py-8">
      <div className="space-y-8">
        <div className="space-y-2">
          <Typography variant="Bold_H3">Settings</Typography>
          <Typography variant="Regular_H7" className="text-muted-foreground">
            Manage site settings and about page content
          </Typography>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex flex-col lg:flex-row gap-8 "
        >
          <TabsList className="flex flex-col h-fit w-full lg:w-64 bg-card border border-border rounded-lg !p-2">
            <TabsTrigger
              value="general"
              className="w-full justify-start cursor-pointer "
            >
              General Settings
            </TabsTrigger>
            <TabsTrigger
              value="about-page"
              className="w-full justify-start cursor-pointer "
            >
              About Page
            </TabsTrigger>
            <TabsTrigger
              value="vision-mission"
              className="w-full justify-start cursor-pointer "
            >
              Vision & Mission
            </TabsTrigger>
            <TabsTrigger
              value="company-story"
              className="w-full justify-start cursor-pointer "
            >
              Company Story
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 min-w-0">
            <TabsContent value="general" className="mt-0">
              <SettingsForm />
            </TabsContent>
            <TabsContent value="about-page" className="mt-0">
              <AboutPageForm />
            </TabsContent>
            <TabsContent value="vision-mission" className="mt-0">
              <AboutBlocksForm />
            </TabsContent>
            <TabsContent value="company-story" className="mt-0">
              <CompanyStoryForm />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
