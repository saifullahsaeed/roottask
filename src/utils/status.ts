import { TaskStatus } from "@prisma/client";
import { Circle, Clock, CheckCircle2, AlertCircle } from "lucide-react";

export function getStatusColor(status: TaskStatus | null): string {
  switch (status) {
    case TaskStatus.TODO:
      return "text-gray-500";
    case TaskStatus.IN_PROGRESS:
      return "text-blue-500";
    case TaskStatus.COMPLETED:
      return "text-green-500";
    default:
      return "text-muted-foreground";
  }
}

export function getStatusIcon(status: TaskStatus | null) {
  switch (status) {
    case TaskStatus.TODO:
      return Circle;
    case TaskStatus.IN_PROGRESS:
      return Clock;
    case TaskStatus.COMPLETED:
      return CheckCircle2;
    default:
      return AlertCircle;
  }
}
