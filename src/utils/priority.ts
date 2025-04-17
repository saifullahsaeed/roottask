import { TaskPriority } from "@prisma/client";
import { Battery, BatteryMedium, BatteryFull, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export function getPriorityColor(priority: TaskPriority | null): string {
  switch (priority) {
    case TaskPriority.LOW:
      return "text-gray-500 font-bold";
    case TaskPriority.MEDIUM:
      return "text-yellow-500 font-bold";
    case TaskPriority.HIGH:
      return "text-red-500 font-bold";
    case TaskPriority.CRITICAL:
      return "text-red-500 font-normal";
    case TaskPriority.BLOCKER:
      return "text-red-800 font-normal";
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
      return "border-priority-low";
    case TaskPriority.MEDIUM:
      return "border-priority-medium";
    case TaskPriority.HIGH:
      return "border-priority-high";
    case TaskPriority.CRITICAL:
      return "border-priority-critical";
    case TaskPriority.BLOCKER:
      return "border-priority-blocker";
    default:
      return "border-border";
  }
}

export function getPriorityStyles(priority: TaskPriority | null): string {
  return cn(
    "transition-colors",
    getPriorityColor(priority),
    getPriorityBgColor(priority),
    getPriorityBorderColor(priority),
    "border"
  );
}
