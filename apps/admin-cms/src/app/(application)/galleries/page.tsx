import { Metadata } from "next";
import { Suspense } from "react";
import GalleriesTable from ".";
import { Typography } from "@/components/typography";

export const metadata: Metadata = {
  title: "Galleries Management",
  description: "Manage all gallery images in the system.",
};

export default function GalleriesPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <Typography variant="Bold_H2">Galleries Management</Typography>
        <Typography variant="Regular_H6" className="text-gray-500">
          Manage all gallery images in the system.
        </Typography>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <GalleriesTable />
      </Suspense>
    </div>
  );
}
