import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui";
import { Skeleton } from "@/components/ui/skeleton";
import { TaskChecklistsSectionProps } from "./types";
import { TaskChecklistWithItems } from "@/types";
import { ChecklistItem } from "./ChecklistItem";
import { ChecklistTitle } from "./ChecklistTitle";

export function TaskChecklistsSection({ taskId }: TaskChecklistsSectionProps) {
  const queryClient = useQueryClient();

  // Fetch checklists
  const { data: checklists = [], isLoading: isFetching } = useQuery<
    TaskChecklistWithItems[]
  >({
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
        (old: TaskChecklistWithItems[] = []) =>
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
        (old: TaskChecklistWithItems[] = []) =>
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
        (old: TaskChecklistWithItems[] = []) => [
          ...old,
          { ...newChecklist, items: [] },
        ]
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
        (old: TaskChecklistWithItems[] = []) =>
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
        (old: TaskChecklistWithItems[] = []) =>
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
        (old: TaskChecklistWithItems[] = []) =>
          old.map((checklist) =>
            checklist.id === checklistId
              ? {
                  ...checklist,
                  items: (checklist.items || []).filter(
                    (item: TaskChecklistWithItems["items"][0]) =>
                      item.id !== itemId
                  ),
                }
              : checklist
          )
      );
    },
  });

  if (isFetching) {
    return (
      <div className="space-y-4" id="checklists-section">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-8 w-20" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-card rounded-xl border shadow-sm overflow-hidden"
            >
              <div className="px-5 py-3.5 bg-muted/30 border-b">
                <div className="flex items-center justify-between mb-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-8 w-24" />
                </div>
                <Skeleton className="h-4 w-48" />
              </div>
              <div className="p-3 space-y-2">
                {[1, 2].map((j) => (
                  <div key={j} className="flex items-center gap-3">
                    <Skeleton className="w-5 h-5 rounded-full" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
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
          {createChecklistMutation.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
          New Checklist
        </Button>
      </div>

      {checklists?.map((checklist: TaskChecklistWithItems) => {
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
                  onUpdate={(name) =>
                    updateChecklistMutation.mutate({
                      taskId,
                      checklistId: checklist.id,
                      data: { name },
                    })
                  }
                  onDelete={() =>
                    deleteChecklistMutation.mutate({
                      checklistId: checklist.id,
                    })
                  }
                  isUpdating={updateChecklistMutation.isPending}
                  isDeleting={deleteChecklistMutation.isPending}
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
                  {createItemMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
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
                  {(checklist.items || []).map(
                    (item: TaskChecklistWithItems["items"][0]) => (
                      <ChecklistItem
                        key={item.id}
                        item={item}
                        checklistId={checklist.id}
                        onUpdate={(updates) =>
                          updateItemMutation.mutate({
                            checklistId: checklist.id,
                            itemId: item.id,
                            updates,
                          })
                        }
                        onDelete={() =>
                          deleteItemMutation.mutate({
                            checklistId: checklist.id,
                            itemId: item.id,
                          })
                        }
                        isUpdating={updateItemMutation.isPending}
                        isDeleting={deleteItemMutation.isPending}
                      />
                    )
                  )}
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
            {createChecklistMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            Create Checklist
          </Button>
        </div>
      )}
    </div>
  );
}
