"use client";

import { Button } from "@/components/ui/button";
import { Trash2, Download } from "lucide-react";

interface ToolbarOptionsProps {
  selectedInquiries: { id: string; name: string }[];
  totalSelectedCount: number;
  resetSelection: () => void;
}

export function ToolbarOptions({
  selectedInquiries,
  totalSelectedCount,
  resetSelection,
}: ToolbarOptionsProps) {
  const handleBulkDelete = () => {
    // This will be implemented later
    console.log("Bulk delete:", selectedInquiries);
  };

  return (
    <div className="flex items-center space-x-2">
      {totalSelectedCount > 0 && (
        <>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleBulkDelete}
            className="cursor-pointer"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete ({totalSelectedCount})
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="cursor-pointer"
          >
            <Download className="mr-2 h-4 w-4" />
            Export ({totalSelectedCount})
          </Button>
        </>
      )}
    </div>
  );
}
