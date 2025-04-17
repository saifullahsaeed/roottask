import { TaskPriority } from "@prisma/client";
import { cn } from "@/lib/utils";
import { getPriorityIcon, getPriorityStyles } from "@/utils/priority";

interface PriorityBadgeProps {
  priority: TaskPriority;
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  const PriorityIcon = getPriorityIcon(priority);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium transition-colors duration-200",
        getPriorityStyles(priority)
      )}
    >
      <PriorityIcon className="w-3 h-3" />
      {priority}
    </span>
  );
}
