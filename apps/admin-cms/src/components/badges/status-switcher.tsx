import { FC, ReactNode } from "react";
import { CheckCircle2, XCircle, Clock, ThumbsUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Typography } from "@/components/typography";

export type IStatus =
  | "active"
  | "inactive"
  | "rejected"
  | "pending"
  | "approved";

const statusConfig: Record<
  IStatus,
  {
    variant: "default" | "secondary" | "destructive" | "outline";
    bgClass?: string;
    icon: ReactNode;
    text: string;
    textClass: string;
  }
> = {
  active: {
    variant: "default",
    bgClass: "bg-green-600 text-background border-green-600",
    icon: (
      <CheckCircle2 className="w-4 h-4 text-background dark:text-foreground" />
    ),
    text: "Active",
    textClass: "text-background dark:text-foreground",
  },
  inactive: {
    variant: "outline",
    bgClass: "bg-red-500 ",
    icon: <XCircle className="w-4 h-4 text-background dark:text-foreground " />,
    text: "Inactive",
    textClass: "text-background dark:text-foreground",
  },
  pending: {
    variant: "secondary",
    bgClass: "bg-yellow-500 border-yellow-600",
    icon: <Clock className="w-4 h-4 text-yellow-700" />,
    text: "Pending",
    textClass: "text-background dark:text-foreground",
  },
  rejected: {
    variant: "destructive",
    bgClass: "bg-red-600 border-red-700",
    icon: <XCircle className="w-4 h-4 text-red-700" />,
    text: "Rejected",
    textClass: "text-background dark:text-foreground",
  },
  approved: {
    variant: "default",
    bgClass: "bg-blue-700  border-blue-700",
    icon: <ThumbsUp className="w-4 h-4 text-blue-700" />,
    text: "Approved",
    textClass: "text-background dark:text-foreground",
  },
};

export const StatusChips: FC<{ status: IStatus }> = ({ status }) => {
  const s = statusConfig[status.toLowerCase() as IStatus];
  return (
    <Badge
      variant={s.variant}
      className={`inline-flex w-fit items-center gap-1 px-3 py-1 rounded-lg border ${s.bgClass}`}
    >
      {s.icon}
      <Typography variant="Medium_H6" className={s.textClass}>
        {s.text}
      </Typography>
    </Badge>
  );
};
