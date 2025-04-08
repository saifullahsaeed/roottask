import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const tooltipVariants = cva(
  "z-50 overflow-hidden rounded-md px-3 py-1.5 text-sm shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
  {
    variants: {
      variant: {
        default: "bg-popover text-popover-foreground",
        dark: "bg-slate-900 text-white",
        light: "bg-white text-slate-900 border border-slate-200",
        primary: "bg-primary text-primary-foreground",
        secondary: "bg-secondary text-secondary-foreground",
        destructive: "bg-destructive text-destructive-foreground",
      },
      size: {
        default: "text-sm",
        sm: "text-xs",
        lg: "text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

interface TooltipProps
  extends React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Root> {
  children: React.ReactNode;
  content: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  sideOffset?: number;
  delayDuration?: number;
  variant?: VariantProps<typeof tooltipVariants>["variant"];
  size?: VariantProps<typeof tooltipVariants>["size"];
  className?: string;
}

const Tooltip = ({
  children,
  content,
  side = "top",
  align = "center",
  sideOffset = 4,
  delayDuration = 300,
  variant,
  size,
  className,
  ...props
}: TooltipProps) => {
  return (
    <TooltipPrimitive.Provider delayDuration={delayDuration}>
      <TooltipPrimitive.Root {...props}>
        <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            side={side}
            align={align}
            sideOffset={sideOffset}
            className={cn(tooltipVariants({ variant, size }), className)}
          >
            {content}
            <TooltipPrimitive.Arrow className="fill-current" />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
};

// For backward compatibility
const SimpleTooltip = ({
  text,
  children,
  className,
}: {
  text: string;
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <Tooltip
      content={<div className="whitespace-pre-wrap break-words">{text}</div>}
      variant="dark"
      className={className}
    >
      {children}
    </Tooltip>
  );
};

export { Tooltip, SimpleTooltip };
