import { Loader2, X } from "lucide-react";
import { Button } from "@/components/ui";
import { Input } from "@/components/ui";
import { useState } from "react";
import {
  DateRangePicker,
  DateValue,
} from "@/components/ui/date-range-picker/DateRangePicker";
import { cn } from "@/lib/utils";

interface CreateTaskProps {
  onSubmit: (data: { title: string; startDate?: Date; dueDate?: Date }) => void;
  onCancel: () => void;
  isLoading?: boolean;
  className?: string;
}

export default function CreateTask({
  onSubmit,
  onCancel,
  isLoading,
  className,
}: CreateTaskProps) {
  const [title, setTitle] = useState("");
  const [dateRange, setDateRange] = useState<DateValue>({
    startDate: null,
    endDate: null,
  });
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || isLoading) return;

    onSubmit({
      title: title.trim(),
      startDate: dateRange.startDate || undefined,
      dueDate: dateRange.endDate || undefined,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "w-full bg-card rounded-lg p-3",
        "border border-border/40 hover:border-border/80",
        "transition-all duration-200",
        "shadow-sm hover:shadow-md",
        isFocused && "ring-2 ring-primary/20 border-primary/40",
        className
      )}
    >
      {/* Header with close button */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-muted-foreground">New Task</h3>
        <button
          type="button"
          onClick={onCancel}
          className="p-1 hover:bg-destructive/10 rounded-lg transition-colors text-destructive opacity-60 hover:opacity-100"
          aria-label="Cancel creating task"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Title Input */}
      <div className="space-y-3">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="What needs to be done?"
          className={cn(
            "text-sm font-medium",
            "bg-transparent border-none shadow-none",
            "px-0 py-1 h-auto",
            "placeholder:text-muted-foreground/50",
            "focus-visible:ring-0"
          )}
          autoFocus
        />

        {/* Date Range Picker */}
        <div className="pt-2 border-t border-border/40">
          <DateRangePicker value={dateRange} onChange={setDateRange} />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            size="sm"
            disabled={!title.trim() || isLoading}
            className={cn(
              "h-8 px-4",
              "bg-primary/10 hover:bg-primary/20",
              "text-primary hover:text-primary",
              "transition-colors"
            )}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Task"
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
