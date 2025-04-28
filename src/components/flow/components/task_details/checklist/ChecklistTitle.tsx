import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { Button, Input } from "@/components/ui";
import { cn } from "@/lib/utils";
import { ChecklistTitleProps } from "./types";

export function ChecklistTitle({
  content,
  onUpdate,
  onDelete,
  isDeleting,
}: ChecklistTitleProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(content);
  const [isHovered, setIsHovered] = useState(false);

  const handleBlur = () => {
    if (title.trim() === "") return;
    setIsEditing(false);
    onUpdate(title);
  };

  return (
    <div
      className="flex items-center gap-2 relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isEditing ? (
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleBlur();
            } else if (e.key === "Escape") {
              setIsEditing(false);
              setTitle(content);
            }
          }}
          className="flex-1 bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-0 text-base font-medium min-w-[200px]"
          autoFocus
        />
      ) : (
        <h3
          className="text-base font-medium cursor-text truncate max-w-[300px] group-hover:text-primary/80 transition-colors"
          onClick={() => setIsEditing(true)}
          title={title}
        >
          {title}
        </h3>
      )}

      <div
        className={cn(
          "flex items-center gap-1 transition-opacity",
          isHovered ? "opacity-100" : "opacity-0"
        )}
      >
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
          onClick={onDelete}
          disabled={isDeleting}
        >
          {isDeleting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Trash2 className="w-4 h-4" />
          )}
        </Button>
      </div>
    </div>
  );
}
