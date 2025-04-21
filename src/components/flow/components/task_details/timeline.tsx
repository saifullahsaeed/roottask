"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Calendar, Clock } from "lucide-react";
import { format } from "date-fns";
import { DateRangePicker } from "@/components/ui/date-range-picker/DateRangePicker";
import type { DateValue } from "@/components/ui/date-range-picker/DateRangePicker";
import { Button } from "@/components/ui";

interface TaskTimelineProps {
  startDate: Date | null;
  dueDate: Date | null;
  onEdit: (startDate: Date | null, dueDate: Date | null) => void;
}

export default function TaskTimeline({
  startDate,
  dueDate,
  onEdit,
}: TaskTimelineProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newStartDate, setNewStartDate] = useState<Date | null>(startDate);
  const [newDueDate, setNewDueDate] = useState<Date | null>(dueDate);

  const handleSave = async (start: Date | null, due: Date | null) => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      await onEdit(start, due);
      setNewStartDate(start);
      setNewDueDate(due);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update timeline:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* View Mode */}
      <div
        role="button"
        tabIndex={0}
        aria-expanded={isEditing}
        aria-label="Edit task dates"
        className={cn(
          "flex items-center gap-3 p-3 rounded-lg border",
          "transition-all duration-200",
          "hover:bg-muted/50",
          "cursor-pointer",
          "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          "border-border"
        )}
        onClick={() => !isLoading && setIsEditing(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setIsEditing(true);
          }
        }}
      >
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-foreground">
            {startDate ? format(startDate, "MMM d, yyyy") : "No start date"}
          </span>
        </div>
        <div className="w-px h-4 bg-border" />
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-foreground">
            {dueDate ? format(dueDate, "MMM d, yyyy") : "No due date"}
          </span>
        </div>
      </div>

      {/* Edit Mode */}
      {isEditing && (
        <div className="space-y-4 p-4 rounded-lg border bg-card">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-foreground">
              Select Dates
            </h3>
            <p className="text-sm text-muted-foreground">
              Choose when this task starts and when it&apos;s due
            </p>
          </div>
          <DateRangePicker
            value={{
              startDate: newStartDate,
              endDate: newDueDate,
            }}
            onChange={({ startDate, endDate }: DateValue) => {
              setNewStartDate(startDate);
              setNewDueDate(endDate);
            }}
            className="w-full"
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="outline"
              className={cn(
                "px-3 py-1.5 text-sm rounded-md",
                "text-muted-foreground",
                "hover:bg-muted",
                "transition-colors duration-200"
              )}
              onClick={() => setIsEditing(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              className={cn(
                "px-3 py-1.5 text-sm rounded-md",
                "text-primary-foreground bg-primary",
                "hover:bg-primary/90",
                "transition-colors duration-200",
                "disabled:opacity-50"
              )}
              variant="default"
              onClick={() => handleSave(newStartDate, newDueDate)}
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
