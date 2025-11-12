import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Typography } from "../typography";

interface IPrimaryButton {
  btnText: string;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  size?: "default" | "sm" | "lg" | "icon" | "icon-sm" | "icon-lg";
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
}

const PrimaryButton = ({
  btnText,
  onClick,
  className,
  disabled,
  loading,
  icon,
  variant = "default",
  size = "lg",
}: IPrimaryButton) => {
  return (
    <Button
      disabled={disabled || loading}
      onClick={onClick}
      size={size}
      variant={variant}
      className={cn(
        "gradient-primary text-white border-0 hover:opacity-90 cursor-pointer",
        className
      )}
    >
      <Typography variant="Medium_H6">{btnText}</Typography>

      {icon && icon}
    </Button>
  );
};

export default PrimaryButton;
