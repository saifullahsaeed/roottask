import { TaskChecklistWithItems } from "@/types";

export interface TaskChecklistsSectionProps {
  taskId: string;
}

export interface ChecklistItemProps {
  item: TaskChecklistWithItems["items"][0];
  checklistId: string;
  onUpdate: (updates: { content?: string; completed?: boolean }) => void;
  onDelete: () => void;
  isUpdating: boolean;
  isDeleting: boolean;
}

export interface ChecklistTitleProps {
  content: string;
  checklistId: string;
  taskId: string;
  onUpdate: (name: string) => void;
  onDelete: () => void;
  isUpdating: boolean;
  isDeleting: boolean;
}
