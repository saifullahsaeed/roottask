import { useState } from "react";
import { Check, Circle, Trash2, Loader2 } from "lucide-react";
import { Button, Input } from "@/components/ui";
import { cn } from "@/lib/utils";
import { ChecklistItemProps } from "./types";

export function ChecklistItem({
  item,
  onUpdate,
  onDelete,
  isUpdating,
  isDeleting,
}: ChecklistItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [itemContent, setItemContent] = useState(item.content);
  const [isHovered, setIsHovered] = useState(false);

  const handleBlur = () => {
    if (itemContent.trim() === "") return;
    setIsEditing(false);
    onUpdate({ content: itemContent });
  };

  return (
    <div
      className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/30 transition-colors group/item relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button
        aria-label={
          item.completed ? "Mark item as incomplete" : "Mark item as complete"
        }
        className={cn(
          "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
          item.completed
            ? "border-primary bg-primary text-primary-foreground hover:bg-primary/90"
            : "border-muted-foreground/30 hover:border-primary hover:bg-muted/50"
        )}
        onClick={() => onUpdate({ completed: !item.completed })}
        disabled={isUpdating}
      >
        {item.completed ? (
          <Check className="w-4 h-4" />
        ) : (
          <Circle className="w-4 h-4" />
        )}
      </button>

      {isEditing ? (
        <Input
          value={itemContent}
          onChange={(e) => setItemContent(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleBlur();
            } else if (e.key === "Escape") {
              setIsEditing(false);
              setItemContent(item.content);
            }
          }}
          className="flex-1 bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
          autoFocus
        />
      ) : (
        <span
          className={cn(
            "text-sm flex-1 cursor-text transition-colors",
            item.completed
              ? "text-muted-foreground line-through"
              : "text-foreground/90 hover:text-foreground"
          )}
          onClick={() => setIsEditing(true)}
        >
          {item.content}
        </span>
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
