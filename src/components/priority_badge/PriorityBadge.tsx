import { TaskPriority } from "@prisma/client";
import { Badge } from "@/components/ui/";
import {
  Flag,
  FlagTriangleLeft,
  CircleDotIcon,
  CircleDotDashedIcon,
} from "lucide-react";

export function PriorityBadge({ priority }: { priority: TaskPriority }) {
  const priorityColor = {
    [TaskPriority.LOW]:
      "bg-green-100/50 dark:bg-green-900/50 text-green-700 dark:text-green-300",
    [TaskPriority.MEDIUM]:
      "bg-yellow-100/50 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300",
    [TaskPriority.HIGH]:
      "bg-orange-100/50 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300",
    [TaskPriority.URGENT]:
      "bg-red-100/50 dark:bg-red-900/50 text-red-700 dark:text-red-300",
  };

  const priorityIcon = {
    [TaskPriority.LOW]: <CircleDotIcon className="w-2.5 h-2.5" />,
    [TaskPriority.MEDIUM]: <CircleDotDashedIcon className="w-2.5 h-2.5" />,
    [TaskPriority.HIGH]: <FlagTriangleLeft className="w-2.5 h-2.5" />,
    [TaskPriority.URGENT]: <Flag className="w-2.5 h-2.5" />,
  };

  return (
    <Badge
      className={`${priorityColor[priority]} text-[10px] font-medium px-1.5 py-0.5`}
      icon={priorityIcon[priority]}
    >
      {priority}
    </Badge>
  );
}
