"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Check,
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  Loader2,
} from "lucide-react";
import { Button, Input } from "@/components/ui";
import { cn } from "@/lib/utils";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/";

// Types
interface TaskChecklistItem {
  id: string;
  content: string;
  completed: boolean;
}

interface TaskChecklist {
  id: string;
  content: string;
  items: TaskChecklistItem[];
}

interface TaskChecklistsSectionProps {
  taskId: string;
}

export default function TaskChecklistsSection({
  taskId,
}: TaskChecklistsSectionProps) {
  const queryClient = useQueryClient();

  // Fetch checklists
  const { data: checklists = [], isLoading: isFetching } = useQuery({
    queryKey: ["task", taskId, "checklists"],
    queryFn: async () => {
      const response = await fetch(`/api/task/${taskId}/checklist`);
      if (!response.ok) throw new Error("Failed to fetch checklists");
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    },
  });

  // Update checklist mutation
  const updateChecklistMutation = useMutation({
    mutationFn: async ({
      taskId,
      checklistId,
      data,
    }: {
      taskId: string;
      checklistId: string;
      data: { name: string };
    }) => {
      const response = await fetch(
        `/api/task/${taskId}/checklist/${checklistId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      if (!response.ok) throw new Error("Failed to update checklist");
      return response.json();
    },
    onSuccess: (updatedChecklist, { checklistId }) => {
      queryClient.setQueryData(
        ["task", taskId, "checklists"],
        (old: TaskChecklist[] = []) =>
          old.map((checklist) =>
            checklist.id === checklistId ? updatedChecklist : checklist
          )
      );
    },
  });

  // Delete checklist mutation
  const deleteChecklistMutation = useMutation({
    mutationFn: async ({ checklistId }: { checklistId: string }) => {
      const response = await fetch(
        `/api/task/${taskId}/checklist/${checklistId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) throw new Error("Failed to delete checklist");
      return response.json();
    },
    onSuccess: (_, { checklistId }) => {
      queryClient.setQueryData(
        ["task", taskId, "checklists"],
        (old: TaskChecklist[] = []) =>
          old.filter((checklist) => checklist.id !== checklistId)
      );
    },
  });

  // Create checklist mutation
  const createChecklistMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/task/${taskId}/checklist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "New Checklist" }),
      });
      if (!response.ok) throw new Error("Failed to create checklist");
      return response.json();
    },
    onSuccess: (newChecklist) => {
      queryClient.setQueryData(
        ["task", taskId, "checklists"],
        (old: TaskChecklist[] = []) => [...old, { ...newChecklist, items: [] }]
      );
    },
  });

  // Create item mutation
  const createItemMutation = useMutation({
    mutationFn: async ({ checklistId }: { checklistId: string }) => {
      const response = await fetch(
        `/api/task/${taskId}/checklist/${checklistId}/item`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: "New item" }),
        }
      );
      if (!response.ok) throw new Error("Failed to create item");
      return response.json();
    },
    onSuccess: (newItem, { checklistId }) => {
      queryClient.setQueryData(
        ["task", taskId, "checklists"],
        (old: TaskChecklist[] = []) =>
          old.map((checklist) =>
            checklist.id === checklistId
              ? { ...checklist, items: [...(checklist.items || []), newItem] }
              : checklist
          )
      );
    },
  });

  // Update item mutation
  const updateItemMutation = useMutation({
    mutationFn: async ({
      checklistId,
      itemId,
      updates,
    }: {
      checklistId: string;
      itemId: string;
      updates: { content?: string; completed?: boolean };
    }) => {
      const response = await fetch(
        `/api/task/${taskId}/checklist/${checklistId}/item`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ itemId, ...updates }),
        }
      );
      if (!response.ok) throw new Error("Failed to update item");
      return response.json();
    },
    onSuccess: (updatedItem, { checklistId, itemId }) => {
      queryClient.setQueryData(
        ["task", taskId, "checklists"],
        (old: TaskChecklist[] = []) =>
          old.map((checklist) =>
            checklist.id === checklistId
              ? {
                  ...checklist,
                  items: (checklist.items || []).map((item) =>
                    item.id === itemId ? updatedItem : item
                  ),
                }
              : checklist
          )
      );
    },
  });

  // Delete item mutation
  const deleteItemMutation = useMutation({
    mutationFn: async ({
      checklistId,
      itemId,
    }: {
      checklistId: string;
      itemId: string;
    }) => {
      const response = await fetch(
        `/api/task/${taskId}/checklist/${checklistId}/item`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ itemId }),
        }
      );
      if (!response.ok) throw new Error("Failed to delete item");
      return response.json();
    },
    onSuccess: (_, { checklistId, itemId }) => {
      queryClient.setQueryData(
        ["task", taskId, "checklists"],
        (old: TaskChecklist[] = []) =>
          old.map((checklist) =>
            checklist.id === checklistId
              ? {
                  ...checklist,
                  items: (checklist.items || []).filter(
                    (item) => item.id !== itemId
                  ),
                }
              : checklist
          )
      );
    },
  });

  // UI Components
  const ChecklistItem = ({
    item,
    checklistId,
  }: {
    item: TaskChecklistItem;
    checklistId: string;
  }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [itemContent, setItemContent] = useState(item.content);
    const [isHovered, setIsHovered] = useState(false);

    const handleBlur = () => {
      if (itemContent.trim() === "") return;
      setIsEditing(false);
      updateItemMutation.mutate({
        checklistId,
        itemId: item.id,
        updates: { content: itemContent },
      });
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
          onClick={() =>
            updateItemMutation.mutate({
              checklistId,
              itemId: item.id,
              updates: { completed: !item.completed },
            })
          }
          disabled={updateItemMutation.isPending}
        >
          {item.completed ? (
            <CheckCircle2 className="w-4 h-4" />
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
            onClick={() =>
              deleteItemMutation.mutate({ checklistId, itemId: item.id })
            }
            disabled={deleteItemMutation.isPending}
          >
            {deleteItemMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
    );
  };

  const ChecklistTitle = ({
    content,
    checklistId,
    taskId,
  }: {
    content: string;
    checklistId: string;
    taskId: string;
  }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(content);
    const [isHovered, setIsHovered] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const handleBlur = () => {
      if (title.trim() === "") return;
      setIsEditing(false);
      updateChecklistMutation.mutate({
        taskId,
        checklistId,
        data: { name: title },
      });
    };

    const handleDelete = () => {
      deleteChecklistMutation.mutate({ checklistId });
      setShowDeleteDialog(false);
    };

    return (
      <>
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
              onClick={() => setShowDeleteDialog(true)}
              disabled={deleteChecklistMutation.isPending}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Checklist</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this checklist? This action
                cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowDeleteDialog(false)}
                disabled={deleteChecklistMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={deleteChecklistMutation.isPending}
              >
                {deleteChecklistMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    );
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4" id="checklists-section">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">
          Checklists
        </h3>
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={() => createChecklistMutation.mutate()}
          disabled={createChecklistMutation.isPending}
        >
          <Plus className="w-4 h-4" />
          New Checklist
        </Button>
      </div>

      {checklists?.map((checklist: TaskChecklist) => {
        const completedItems = (checklist.items || []).filter(
          (item) => item.completed
        ).length;
        const totalItems = (checklist.items || []).length;

        return (
          <div
            key={checklist.id}
            className="bg-card rounded-xl border shadow-sm hover:shadow-md transition-all overflow-hidden group"
          >
            <div className="px-5 py-3.5 bg-muted/30 border-b">
              <div className="flex items-center justify-between mb-2">
                <ChecklistTitle
                  content={checklist.content}
                  checklistId={checklist.id}
                  taskId={taskId}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-3 gap-2 hover:bg-muted/50 transition-colors flex-shrink-0"
                  onClick={() =>
                    createItemMutation.mutate({ checklistId: checklist.id })
                  }
                  disabled={createItemMutation.isPending}
                >
                  <Plus className="w-4 h-4" />
                  Add Item
                </Button>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span>
                    {completedItems} of {totalItems} completed
                  </span>
                </div>
              </div>
            </div>
            <div className="p-3">
              {(checklist.items || []).length > 0 ? (
                <div className="space-y-1">
                  {(checklist.items || []).map((item: TaskChecklistItem) => (
                    <ChecklistItem
                      key={item.id}
                      item={item}
                      checklistId={checklist.id}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="w-12 h-12 rounded-full bg-muted/30 text-muted-foreground flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    <Check className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    No items yet
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Click &quot;Add Item&quot; to start breaking down your task
                  </p>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {!checklists?.length && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 rounded-full bg-muted/30 text-muted-foreground flex items-center justify-center mb-4">
            <Check className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-medium mb-2">No checklists yet</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Create a checklist to organize your task into manageable steps
          </p>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => createChecklistMutation.mutate()}
            disabled={createChecklistMutation.isPending}
          >
            <Plus className="w-4 h-4" />
            Create Checklist
          </Button>
        </div>
      )}
    </div>
  );
}
