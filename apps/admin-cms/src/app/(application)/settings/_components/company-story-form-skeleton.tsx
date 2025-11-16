"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export function CompanyStoryFormSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-8 w-36" />
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {/* Story Section */}
          <div className="space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-6 w-24" />
              <Separator />
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full" />
              </div>

              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-48 w-full" />
              </div>

              <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-10 w-full" />
              </div>

              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <div className="flex items-center justify-center border-2 border-dashed border-border rounded-lg h-48">
                  <Skeleton className="h-6 w-32" />
                </div>
              </div>
            </div>
          </div>

          {/* Timeline Section */}
          <div className="space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-6 w-28" />
              <Separator />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-4 w-64" />
              <div className="space-y-6">
                <div className="space-y-2 p-6">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-16 w-full" />
                </div>
                <div className="space-y-2 p-6">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-16 w-full" />
                </div>
                <div className="space-y-2 p-6">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-16 w-full" />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <Skeleton className="h-10 w-40" />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
