import { Typography } from "@/components/typography";
import TestimonialsTable from "./index";
import { Suspense } from "react";

export default function ServicesPage() {
  return (
    <div className="container mx-auto py-10">
      <div>
        <Typography variant="Bold_H2">Testimonials Management</Typography>
        <Typography variant="Regular_H6" className="text-gray-500">
          Manage all testimonials in the system.
        </Typography>
      </div>
      <div className="mt-10">
        <Suspense fallback={<div>Loading...</div>}>
          <TestimonialsTable />
        </Suspense>
      </div>
    </div>
  );
}
