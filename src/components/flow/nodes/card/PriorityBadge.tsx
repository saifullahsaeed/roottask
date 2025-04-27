import { TaskPriority } from "@prisma/client";
import { cn } from "@/lib/utils";

const priorityColors: Record<
  TaskPriority,
  {
    bg: string;
    text: string;
    border: string;
    hover: string;
    dot: string;
  }
> = {
  LOW: {
    bg: "bg-gray-100 dark:bg-gray-800",
    text: "text-gray-700 dark:text-gray-300",
    border: "border-gray-200 dark:border-gray-700",
    hover: "hover:bg-gray-200 dark:hover:bg-gray-700",
    dot: "bg-gray-500 dark:bg-gray-400",
  },
  MEDIUM: {
    bg: "bg-blue-100 dark:bg-blue-900",
    text: "text-blue-700 dark:text-blue-300",
    border: "border-blue-200 dark:border-blue-800",
    hover: "hover:bg-blue-200 dark:hover:bg-blue-800",
    dot: "bg-blue-500 dark:bg-blue-400",
  },
  HIGH: {
    bg: "bg-orange-100 dark:bg-orange-900",
    text: "text-orange-700 dark:text-orange-300",
    border: "border-orange-200 dark:border-orange-800",
    hover: "hover:bg-orange-200 dark:hover:bg-orange-800",
    dot: "bg-orange-500 dark:bg-orange-400",
  },
  CRITICAL: {
    bg: "bg-red-100 dark:bg-red-900",
    text: "text-red-700 dark:text-red-300",
    border: "border-red-200 dark:border-red-800",
    hover: "hover:bg-red-200 dark:hover:bg-red-800",
    dot: "bg-red-500 dark:bg-red-400",
  },
  BLOCKER: {
    bg: "bg-purple-100 dark:bg-purple-900",
    text: "text-purple-700 dark:text-purple-300",
    border: "border-purple-200 dark:border-purple-800",
    hover: "hover:bg-purple-200 dark:hover:bg-purple-800",
    dot: "bg-purple-500 dark:bg-purple-400",
  },
};

interface PriorityBadgeProps {
  priority: TaskPriority;
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  const colors = priorityColors[priority];

  return (
    <div className="group relative">
      <div className="absolute inset-0 -m-0.5 rounded-md bg-primary/5 opacity-0 group-hover:opacity-100 transition-all duration-200" />
      <span
        className={cn(
          "inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium transition-all duration-200 relative z-10",
          "border",
          colors.bg,
          colors.text,
          colors.border,
          colors.hover,
          "group-hover:scale-105"
        )}
      >
        <div className={cn("w-2 h-2 rounded-full", colors.dot)} />
        <span className="capitalize">{priority.toLowerCase()}</span>
      </span>
    </div>
  );
}
