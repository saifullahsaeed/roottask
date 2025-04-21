import { getInitials } from "@/utils/string/getinitials";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface AvatarInitialsProps {
  name: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "secondary" | "outline";
  className?: string;
  onClick?: () => void;
  isActive?: boolean;
}

export default function AvatarInitials({
  name,
  size = "md",
  variant = "default",
  className,
  onClick,
  isActive = false,
}: AvatarInitialsProps) {
  const sizeClasses = {
    sm: "w-6 h-6 text-xs",
    md: "w-8 h-8 text-sm",
    lg: "w-10 h-10 text-base",
  };

  const variantClasses = {
    default: "bg-primary/10 text-primary",
    secondary: "bg-secondary/10 text-secondary",
    outline: "bg-background text-foreground border border-border",
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "rounded-full flex items-center justify-center font-medium ring-2 ring-background transition-all duration-200",
        sizeClasses[size],
        variantClasses[variant],
        isActive && "ring-primary ring-offset-2",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      {getInitials(name)}
    </motion.div>
  );
}
