import { TaskPriority } from "@prisma/client";
import { Battery, BatteryMedium, BatteryFull, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export function getPriorityColor(priority: TaskPriority | null): string {
  switch (priority) {
    case TaskPriority.LOW:
      return "text-priority-low font-medium";
    case TaskPriority.MEDIUM:
      return "text-priority-medium font-medium";
    case TaskPriority.HIGH:
      return "text-priority-high font-semibold";
    case TaskPriority.CRITICAL:
      return "text-priority-critical font-semibold";
    case TaskPriority.BLOCKER:
      return "text-priority-blocker font-bold";
    default:
      return "text-muted-foreground";
  }
}

export function getPriorityIcon(priority: TaskPriority | null) {
  switch (priority) {
    case TaskPriority.LOW:
      return Battery;
    case TaskPriority.MEDIUM:
      return BatteryMedium;
    case TaskPriority.HIGH:
      return BatteryFull;
    case TaskPriority.CRITICAL:
      return BatteryFull;
    case TaskPriority.BLOCKER:
      return Zap;
    default:
      return Battery;
  }
}

export function getPriorityBgColor(priority: TaskPriority | null): string {
  switch (priority) {
    case TaskPriority.LOW:
      return "bg-priority-low-light dark:bg-priority-low-dark";
    case TaskPriority.MEDIUM:
      return "bg-priority-medium-light dark:bg-priority-medium-dark";
    case TaskPriority.HIGH:
      return "bg-priority-high-light dark:bg-priority-high-dark";
    case TaskPriority.CRITICAL:
      return "bg-priority-critical-light dark:bg-priority-critical-dark";
    case TaskPriority.BLOCKER:
      return "bg-priority-blocker-light dark:bg-priority-blocker-dark";
    default:
      return "bg-transparent";
  }
}

export function getPriorityBorderColor(priority: TaskPriority | null): string {
  switch (priority) {
    case TaskPriority.LOW:
      return "border-slate-200 dark:border-slate-700";
    case TaskPriority.MEDIUM:
      return "border-amber-200 dark:border-amber-700";
    case TaskPriority.HIGH:
      return "border-orange-200 dark:border-orange-700";
    case TaskPriority.CRITICAL:
      return "border-rose-200 dark:border-rose-700";
    case TaskPriority.BLOCKER:
      return "border-red-200 dark:border-red-700";
    default:
      return "border-border";
  }
}

export function getPriorityStyles(priority: TaskPriority | null): string {
  return cn(
    "transition-colors",
    getPriorityColor(priority),
    getPriorityBgColor(priority),
    "rounded-md px-2 py-1"
  );
}
