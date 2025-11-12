import { Metadata } from "next";
import { Suspense } from "react";
import SlidersTable from ".";
import { Typography } from "@/components/typography";

export const metadata: Metadata = {
  title: "Sliders Management",
  description: "Manage all sliders in the system.",
};

export default function SlidersPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <Typography variant="Bold_H2">Sliders Management</Typography>
        <Typography variant="Regular_H6" className="text-gray-500">
          Manage all sliders in the system.
        </Typography>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <SlidersTable />
      </Suspense>
    </div>
  );
}