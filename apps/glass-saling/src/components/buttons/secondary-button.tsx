import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Typography } from "../typography";

interface ISecondaryButton {
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

const SecondaryButton = ({
  btnText,
  onClick,
  className,
  disabled,
  loading,
  icon,
  variant = "default",
  size = "lg",
}: ISecondaryButton) => {
  return (
    <Button
      disabled={disabled || loading}
      onClick={onClick}
      size={size}
      variant={variant}
      className={cn(
        "glass-button text-primary-foreground border-primary-foreground/30 cursor-pointer dark:border-primary-foreground/20 dark:text-primary-foreground/90 hover:opacity-90",
        className
      )}
    >
      <Typography variant="Medium_H6">{btnText}</Typography>

      {icon && icon}
    </Button>
  );
};

export default SecondaryButton;
