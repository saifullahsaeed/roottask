"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Pencil } from "lucide-react";

interface TaskDescriptionProps {
  description: string | null;
  onEdit: (description: string | null) => void;
}

const MAX_DESCRIPTION_LENGTH = 500;

export default function TaskDescription({
  description,
  onEdit,
}: TaskDescriptionProps) {
  const [isEditing, setIsEditing] = useState(description === null);
  const [editedDescription, setEditedDescription] = useState(description || "");
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current && isEditing) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [editedDescription, isEditing]);

  const handleSave = () => {
    if (isLoading) return;

    const trimmedDescription = editedDescription.trim();
    if (trimmedDescription === (description || "")) {
      setIsEditing(false);
      return;
    }

    setIsLoading(true);
    try {
      onEdit(trimmedDescription || null);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update description:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsEditing(false);
      setEditedDescription(description || "");
    }
  };

  return (
    <div className="relative group">
      <div
        className={cn(
          "flex flex-col gap-2 p-3 rounded-lg",
          "transition-all duration-200",
          !isEditing && "hover:bg-gray-50 dark:hover:bg-gray-800/50",
          isEditing && "bg-gray-50 dark:bg-gray-800/50"
        )}
      >
        {isEditing ? (
          <div className="relative w-full">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {editedDescription.length}/{MAX_DESCRIPTION_LENGTH}
              </div>
            </div>
            <textarea
              ref={textareaRef}
              className={cn(
                "w-full min-h-[100px] p-2 rounded-md",
                "border border-gray-200 dark:border-gray-700",
                "bg-white dark:bg-gray-800",
                "text-gray-900 dark:text-gray-100",
                "placeholder-gray-400 dark:placeholder-gray-500",
                "transition-all duration-200",
                "resize-none",
                "focus:outline-none focus:ring-0 focus:border-gray-300 dark:focus:border-gray-600"
              )}
              value={editedDescription}
              autoFocus={description === null}
              onFocus={(e) => e.target.select()}
              onChange={(e) => {
                if (e.target.value.length <= MAX_DESCRIPTION_LENGTH) {
                  setEditedDescription(e.target.value);
                }
              }}
              onKeyDown={handleKeyDown}
              onBlur={handleSave}
              placeholder="Add a description..."
              rows={10}
              disabled={isLoading}
            />
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Press Escape to cancel
            </div>
          </div>
        ) : (
          <div
            className="relative group cursor-pointer"
            onClick={() => setIsEditing(true)}
          >
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                <Pencil className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap">
              {description || "No description"}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
