import { Metadata } from "next";
import { Suspense } from "react";
import ContactUsTable from ".";
import { Typography } from "@/components/typography";

export const metadata: Metadata = {
  title: "Contact Us Management",
  description: "Manage all contact inquiries in the system.",
};

export default function ContactUsPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <Typography variant="Bold_H2">Contact Us Management</Typography>
        <Typography variant="Regular_H6" className="text-gray-500">
          Manage all contact inquiries in the system.
        </Typography>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <ContactUsTable />
      </Suspense>
    </div>
  );
}
