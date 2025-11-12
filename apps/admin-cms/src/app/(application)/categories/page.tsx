import { Metadata } from "next";
import { Suspense } from "react";
import CategoriesTable from ".";
import { Typography } from "@/components/typography";

export const metadata: Metadata = {
  title: "Categories Management",
  description: "Manage all categories in the system.",
};

export default function CategoriesPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <Typography variant="Bold_H2">Categories Management</Typography>
        <Typography variant="Regular_H6" className="text-gray-500">
          Manage all categories in the system.
        </Typography>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <CategoriesTable />
      </Suspense>
    </div>
  );
}
