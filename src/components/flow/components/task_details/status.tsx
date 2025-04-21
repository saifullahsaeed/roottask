"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { TaskStatus } from "@prisma/client";

interface TaskStatusSelectorProps {
  status: TaskStatus;
  onEdit: (status: TaskStatus) => void;
}

const statusOptions: { value: TaskStatus; label: string }[] = [
  { value: "TODO", label: "To Do" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "COMPLETED", label: "Completed" },
];

const statusColors = {
  TODO: {
    bg: "bg-gray-100/50 dark:bg-gray-800/50",
    text: "text-gray-600 dark:text-gray-400",
    border: "border-gray-200 dark:border-gray-700",
    hover: "hover:bg-gray-100 dark:hover:bg-gray-800",
  },
  IN_PROGRESS: {
    bg: "bg-blue-100/50 dark:bg-blue-900/50",
    text: "text-blue-600 dark:text-blue-400",
    border: "border-blue-200 dark:border-blue-800",
    hover: "hover:bg-blue-100 dark:hover:bg-blue-900",
  },
  COMPLETED: {
    bg: "bg-green-100/50 dark:bg-green-900/50",
    text: "text-green-600 dark:text-green-400",
    border: "border-green-200 dark:border-green-800",
    hover: "hover:bg-green-100 dark:hover:bg-green-900",
  },
};

export default function TaskStatusSelector({
  status,
  onEdit,
}: TaskStatusSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleStatusChange = (newStatus: TaskStatus) => {
    if (isLoading || newStatus === status) return;

    setIsLoading(true);
    try {
      onEdit(newStatus);
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to update status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative w-full">
      <button
        className={cn(
          "flex items-center justify-between w-full px-3 py-2 rounded-md",
          "border transition-all duration-200",
          "outline-none focus:ring-0",
          statusColors[status].bg,
          statusColors[status].text,
          statusColors[status].border,
          statusColors[status].hover,
          "group"
        )}
        onClick={() => !isLoading && setIsOpen(!isOpen)}
        disabled={isLoading}
      >
        <span className="text-sm font-medium">
          {statusOptions.find((opt) => opt.value === status)?.label}
        </span>
        <ChevronDown
          className={cn(
            "w-4 h-4 transition-transform duration-200",
            isOpen && "rotate-180",
            "opacity-60 group-hover:opacity-100"
          )}
        />
      </button>

      {isOpen && (
        <div
          className={cn(
            "absolute top-full left-0 right-0 mt-1",
            "bg-white dark:bg-gray-800",
            "rounded-md shadow-lg",
            "border border-gray-200 dark:border-gray-700",
            "z-10",
            "animate-in fade-in zoom-in-95 duration-200"
          )}
        >
          {statusOptions.map((option) => (
            <button
              key={option.value}
              className={cn(
                "w-full px-3 py-2 text-left text-sm",
                "transition-colors duration-200",
                "first:rounded-t-md last:rounded-b-md",
                status === option.value && "font-medium",
                statusColors[option.value].text,
                statusColors[option.value].hover,
                "flex items-center gap-2"
              )}
              onClick={() => handleStatusChange(option.value)}
              disabled={isLoading}
            >
              <div
                className={cn(
                  "w-2 h-2 rounded-full",
                  statusColors[option.value].bg,
                  statusColors[option.value].border
                )}
              />
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
