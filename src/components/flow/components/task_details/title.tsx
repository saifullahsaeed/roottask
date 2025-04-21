"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface TaskTitleProps {
  title: string;
  onEdit: (title: string) => void;
}

const MAX_TITLE_LENGTH = 100;

export default function TaskTitle({ title, onEdit }: TaskTitleProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current && isEditing) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [editedTitle, isEditing]);

  const handleSave = () => {
    if (isLoading) return;

    const trimmedTitle = editedTitle.trim();
    if (!trimmedTitle || trimmedTitle === title) {
      setIsEditing(false);
      return;
    }

    setIsLoading(true);
    try {
      onEdit(trimmedTitle);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update title:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === "Escape") {
      setIsEditing(false);
      setEditedTitle(title);
    }
  };

  return (
    <div className="relative">
      <div
        className="flex items-center gap-2"
        onClick={() => !isEditing && setIsEditing(true)}
      >
        {isEditing ? (
          <div className="relative w-full">
            <textarea
              ref={textareaRef}
              className={cn(
                "w-full border-0 outline-none ring-0 focus:ring-0 focus:outline-none focus:shadow-none focus:border-0 focus:ring-offset-0 bg-transparent",
                "text-2xl font-bold resize-none overflow-hidden",
                "placeholder-gray-400 dark:placeholder-gray-500",
                "transition-all duration-200"
              )}
              value={editedTitle}
              autoFocus
              onFocus={(e) => e.target.select()}
              onChange={(e) => {
                if (e.target.value.length <= MAX_TITLE_LENGTH) {
                  setEditedTitle(e.target.value);
                }
              }}
              onKeyDown={handleKeyDown}
              onBlur={handleSave}
              placeholder="Enter task title..."
              rows={1}
              disabled={isLoading}
            />
            <div className="absolute -bottom-5 right-0 text-xs text-gray-500 dark:text-gray-400">
              {editedTitle.length}/{MAX_TITLE_LENGTH}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold break-words">
              {title || "Untitled Task"}
            </h1>
          </div>
        )}
      </div>
    </div>
  );
}
