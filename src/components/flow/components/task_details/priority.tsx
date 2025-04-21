"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { TaskPriority } from "@prisma/client";

interface TaskPrioritySelectorProps {
  priority: TaskPriority | null;
  onEdit: (priority: TaskPriority | null) => void;
}

const priorityOptions: { value: TaskPriority; label: string }[] = [
  { value: "LOW", label: "Low" },
  { value: "MEDIUM", label: "Medium" },
  { value: "HIGH", label: "High" },
  { value: "CRITICAL", label: "Critical" },
  { value: "BLOCKER", label: "Blocker" },
];

const priorityColors: Record<
  TaskPriority,
  {
    bg: string;
    text: string;
    border: string;
    hover: string;
  }
> = {
  LOW: {
    bg: "bg-gray-100/50 dark:bg-gray-800/50",
    text: "text-gray-600 dark:text-gray-400",
    border: "border-gray-200 dark:border-gray-700",
    hover: "hover:bg-gray-100 dark:hover:bg-gray-800",
  },
  MEDIUM: {
    bg: "bg-blue-100/50 dark:bg-blue-900/50",
    text: "text-blue-600 dark:text-blue-400",
    border: "border-blue-200 dark:border-blue-800",
    hover: "hover:bg-blue-100 dark:hover:bg-blue-900",
  },
  HIGH: {
    bg: "bg-orange-100/50 dark:bg-orange-900/50",
    text: "text-orange-600 dark:text-orange-400",
    border: "border-orange-200 dark:border-orange-800",
    hover: "hover:bg-orange-100 dark:hover:bg-orange-900",
  },
  CRITICAL: {
    bg: "bg-red-100/50 dark:bg-red-900/50",
    text: "text-red-600 dark:text-red-400",
    border: "border-red-200 dark:border-red-800",
    hover: "hover:bg-red-100 dark:hover:bg-red-900",
  },
  BLOCKER: {
    bg: "bg-purple-100/50 dark:bg-purple-900/50",
    text: "text-purple-600 dark:text-purple-400",
    border: "border-purple-200 dark:border-purple-800",
    hover: "hover:bg-purple-100 dark:hover:bg-purple-900",
  },
};

const defaultPriorityStyle = {
  bg: "bg-transparent",
  text: "text-gray-500 dark:text-gray-400",
  border: "border-gray-200 dark:border-gray-700",
  hover: "hover:bg-gray-50 dark:hover:bg-gray-800/50",
};

export default function TaskPrioritySelector({
  priority,
  onEdit,
}: TaskPrioritySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handlePriorityChange = async (newPriority: TaskPriority | null) => {
    if (isLoading || newPriority === priority) return;

    setIsLoading(true);
    try {
      await onEdit(newPriority);
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to update priority:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const currentStyle = priority
    ? priorityColors[priority]
    : defaultPriorityStyle;

  return (
    <div className="relative w-full">
      <button
        className={cn(
          "flex items-center justify-between w-full px-3 py-2 rounded-md",
          "border transition-all duration-200",
          "outline-none focus:ring-0",
          currentStyle.bg,
          currentStyle.text,
          currentStyle.border,
          currentStyle.hover,
          "group"
        )}
        onClick={() => !isLoading && setIsOpen(!isOpen)}
        disabled={isLoading}
      >
        <span className="text-sm font-medium">
          {priority
            ? priorityOptions.find((opt) => opt.value === priority)?.label
            : "Set Priority"}
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
          <button
            className={cn(
              "w-full px-3 py-2 text-left text-sm",
              "transition-colors duration-200",
              "first:rounded-t-md",
              !priority && "font-medium",
              defaultPriorityStyle.text,
              defaultPriorityStyle.hover,
              "flex items-center gap-2"
            )}
            onClick={() => handlePriorityChange(null)}
            disabled={isLoading}
          >
            <div
              className={cn(
                "w-2 h-2 rounded-full",
                defaultPriorityStyle.bg,
                defaultPriorityStyle.border
              )}
            />
            No Priority
          </button>
          {priorityOptions.map((option) => (
            <button
              key={option.value}
              className={cn(
                "w-full px-3 py-2 text-left text-sm",
                "transition-colors duration-200",
                "last:rounded-b-md",
                priority === option.value && "font-medium",
                priorityColors[option.value].text,
                priorityColors[option.value].hover,
                "flex items-center gap-2"
              )}
              onClick={() => handlePriorityChange(option.value)}
              disabled={isLoading}
            >
              <div
                className={cn(
                  "w-2 h-2 rounded-full",
                  priorityColors[option.value].bg,
                  priorityColors[option.value].border
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
