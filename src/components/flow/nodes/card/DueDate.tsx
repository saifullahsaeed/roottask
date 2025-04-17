import { Calendar, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface DueDateProps {
  dueDate: string;
}

export function DueDate({ dueDate }: DueDateProps) {
  const formattedDate = new Date(dueDate).toLocaleDateString();
  const isPastDue = new Date(dueDate) < new Date();
  const isToday =
    new Date(dueDate).toDateString() === new Date().toDateString();

  return (
    <div
      className={cn(
        "flex items-center gap-1 text-xs font-medium",
        isPastDue
          ? "text-red-500"
          : isToday
          ? "text-primary"
          : "text-muted-foreground"
      )}
    >
      {isPastDue ? (
        <Clock className="w-3 h-3" />
      ) : (
        <Calendar className="w-3 h-3" />
      )}
      <span>{formattedDate}</span>
    </div>
  );
}
