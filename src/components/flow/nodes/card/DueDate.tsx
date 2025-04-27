import { Calendar, Clock, AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { TaskStatus } from "@prisma/client";
import { Tooltip } from "@/components/ui/tooltip/tooltip";

interface DueDateProps {
  status: TaskStatus;
  startDate: string;
  dueDate: string;
}

export function DueDate({ status, startDate, dueDate }: DueDateProps) {
  const start = new Date(startDate);
  const end = new Date(dueDate);
  const now = new Date();

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const getRelativeTime = (date: Date) => {
    const diffTime = Math.abs(date.getTime() - now.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (date < now) {
      return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
    }
    return `in ${diffDays} day${diffDays !== 1 ? "s" : ""}`;
  };

  const isStartDatePast = start < now;
  const isDueDatePast = end < now;
  const isInProgress = status === "IN_PROGRESS";
  const isTodo = status === "TODO";
  const isCompleted = status === "COMPLETED";

  const getDateDisplay = () => {
    if (startDate === dueDate) {
      return formatDate(start);
    }
    return `${formatDate(start)} - ${formatDate(end)}`;
  };

  const getStatusStyles = () => {
    if (isCompleted) {
      return "text-green-500";
    }
    if (isDueDatePast) {
      return "text-red-500";
    }
    if (isStartDatePast && isTodo) {
      return "text-yellow-500";
    }
    if (isInProgress) {
      return "text-primary";
    }
    return "text-muted-foreground";
  };

  const getStatusIcon = () => {
    if (isCompleted) {
      return <CheckCircle2 className="w-3 h-3" />;
    }
    if (isDueDatePast) {
      return <Clock className="w-3 h-3" />;
    }
    if (isStartDatePast && isTodo) {
      return <AlertCircle className="w-3 h-3" />;
    }
    return <Calendar className="w-3 h-3" />;
  };

  const getTooltipContent = () => {
    if (isCompleted) {
      return `Completed on ${formatDate(end)}`;
    }
    if (isDueDatePast) {
      return `Overdue by ${getRelativeTime(end)}`;
    }
    if (isStartDatePast && isTodo) {
      return `Should have started ${getRelativeTime(start)}`;
    }
    if (isInProgress) {
      return `Due ${getRelativeTime(end)}`;
    }
    return `Starts ${getRelativeTime(start)}`;
  };

  return (
    <Tooltip
      content={
        <div className="text-xs whitespace-nowrap">{getTooltipContent()}</div>
      }
      variant="dark"
      size="sm"
    >
      <div
        className={cn(
          "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-md transition-colors",
          getStatusStyles(),
          "hover:bg-muted/50 cursor-help"
        )}
        role="status"
        aria-label={`Task timeline: ${getTooltipContent()}`}
      >
        {getStatusIcon()}
        <span>{getDateDisplay()}</span>
      </div>
    </Tooltip>
  );
}
