"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export function AboutBlocksFormSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-8 w-48" />
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {/* Vision Section */}
          <div className="space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-6 w-20" />
              <Separator />
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-24 w-full" />
              </div>

              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <div className="flex items-center justify-center border-2 border-dashed border-border rounded-lg h-32">
                  <Skeleton className="h-6 w-32" />
                </div>
              </div>
            </div>
          </div>

          {/* Mission Section */}
          <div className="space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-6 w-20" />
              <Separator />
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-24 w-full" />
              </div>

              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <div className="flex items-center justify-center border-2 border-dashed border-border rounded-lg h-32">
                  <Skeleton className="h-6 w-32" />
                </div>
              </div>
            </div>
          </div>

          {/* Values Section */}
          <div className="space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-6 w-20" />
              <Separator />
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-24 w-full" />
              </div>

              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <div className="flex items-center justify-center border-2 border-dashed border-border rounded-lg h-32">
                  <Skeleton className="h-6 w-32" />
                </div>
              </div>
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
