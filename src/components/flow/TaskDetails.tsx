import { Node } from "reactflow";
import {
  ChevronLeft,
  MoreVertical,
  FileText,
  ListChecks,
  Paperclip,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";

import TaskTitle from "@/components/flow/components/task_details/title";
import { useFlowStore } from "./store/useFlowStore";
import TaskDescription from "@/components/flow/components/task_details/description";
import TaskStatusSelector from "@/components/flow/components/task_details/status";
import TaskPrioritySelector from "@/components/flow/components/task_details/priority";
import TaskTimeline from "@/components/flow/components/task_details/timeline";
import TaskAssignee from "@/components/flow/components/task_details/assignee";
import TaskChecklistsSection from "@/components/flow/components/task_details/checklist";
import TaskAttachmentsSection from "@/components/flow/components/task_details/attachments";
import { TaskDiscussionsSection } from "@/components/flow/components/task_details/discussion";
import { scrollToElement } from "@/utils/scroll";
import { TaskWithRelations } from "@/types";

interface TaskDetailsProps {
  node: Node | null;
  taskflowId: string;
  onClose: () => void;
}

export function TaskDetails({ node, onClose, taskflowId }: TaskDetailsProps) {
  const { updateNode } = useFlowStore();
  const queryClient = useQueryClient();
  const { data: taskData, isLoading } = useQuery<TaskWithRelations>({
    queryKey: [`task-${node?.id}`],
    queryFn: async () => {
      if (!node?.data.id) return null;
      const response = await fetch(`/api/task/${node.data.id}`);
      if (!response.ok) throw new Error("Failed to fetch task");
      return response.json();
    },
    enabled: !!node?.data.id,
  });

  const { mutate: updateTask } = useMutation({
    mutationFn: async (data: {
      title?: string;
      description?: string;
      status?: string;
      priority?: string;
      startDate?: string;
      dueDate?: string;
    }) => {
      console.log("data in mutation", data);
      if (!taskData?.id || !taskflowId) {
        throw new Error("Task ID or Flow ID is missing");
      }
      const response = await fetch(
        `/api/taskflows/${taskflowId}/nodes/tasks/${taskData.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update task");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`task-${node?.id}`] });
    },
  });

  const handleEditTask = (data: {
    title?: string | null;
    description?: string | null;
    status?: string | null;
    priority?: string | null;
    startDate?: string | null;
    dueDate?: string | null;
  }) => {
    if (!node?.id) return;
    //remove null values
    const filteredData = Object.fromEntries(
      Object.entries(data).filter(([value]) => value !== null)
    );
    updateNode(node?.id, {
      ...node?.data,
      ...filteredData,
    });
    updateTask(filteredData);
  };

  if (!node) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-muted-foreground">Select a card to view details</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-muted-foreground">Loading task details...</p>
      </div>
    );
  }

  if (!taskData) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-muted-foreground">Task not found</p>
      </div>
    );
  }

  // Ensure dates are Date objects
  const startDate = taskData.startDate ? new Date(taskData.startDate) : null;
  const dueDate = taskData.dueDate ? new Date(taskData.dueDate) : null;

  return (
    <div className="h-full flex bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-lg shadow-black/5">
      {/* Sidebar */}
      <div className="w-12 border-r border-border/40 bg-background/80 backdrop-blur flex flex-col items-center py-4 gap-2">
        <button
          onClick={onClose}
          className="inline-flex items-center justify-center w-8 h-8 rounded-md hover:bg-muted/50 transition-colors group relative"
          title="Close"
        >
          <ChevronLeft className="w-4 h-4 group-hover:scale-110 transition-transform" />
          <span className="absolute left-full ml-2 px-2 py-1 text-xs rounded-md bg-foreground text-background opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Close
          </span>
        </button>
        <div className="h-px w-8 bg-border/40 my-1" />
        <button
          className="w-8 h-8 rounded-md hover:bg-muted/50 transition-colors flex items-center justify-center group relative"
          title="Details"
          onClick={() => scrollToElement("details-section")}
        >
          <FileText className="w-4 h-4 group-hover:scale-110 transition-transform" />
          <span className="absolute left-full ml-2 px-2 py-1 text-xs rounded-md bg-foreground text-background opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Details
          </span>
        </button>

        <button
          className="w-8 h-8 rounded-md hover:bg-muted/50 transition-colors flex items-center justify-center group relative"
          title="Checklists"
          onClick={() => scrollToElement("checklists-section")}
        >
          <ListChecks className="w-4 h-4 group-hover:scale-110 transition-transform" />
          <span className="absolute left-full ml-2 px-2 py-1 text-xs rounded-md bg-foreground text-background opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Checklists
          </span>
        </button>
        <button
          className="w-8 h-8 rounded-md hover:bg-muted/50 transition-colors flex items-center justify-center group relative"
          title="Attachments"
          onClick={() => scrollToElement("attachments-section")}
        >
          <Paperclip className="w-4 h-4 group-hover:scale-110 transition-transform" />
          <span className="absolute left-full ml-2 px-2 py-1 text-xs rounded-md bg-foreground text-background opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Attachments
          </span>
        </button>
        <button
          className={cn(
            "w-8 h-8 rounded-md transition-all duration-200 flex items-center justify-center group relative",
            "hover:bg-primary/10 hover:ring-1 hover:ring-primary/20",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          )}
          title="Chat"
        >
          <MessageCircle
            className={cn(
              "w-4 h-4 transition-all duration-200",
              "text-muted-foreground group-hover:text-primary",
              "group-hover:scale-110"
            )}
          />
          <Badge
            variant="outline"
            className={cn(
              "absolute -top-1 -right-1 h-4 min-w-[16px] px-1",
              "bg-primary text-primary-foreground",
              "border-none",
              "text-[10px] font-medium",
              "flex items-center justify-center",
              "group-hover:bg-primary/90",
              "transition-colors duration-200",
              "shadow-sm"
            )}
          >
            3
          </Badge>
          <span
            className={cn(
              "absolute left-full ml-2 px-2 py-1 text-xs rounded-md",
              "bg-foreground text-background",
              "opacity-0 group-hover:opacity-100",
              "transition-all duration-200",
              "whitespace-nowrap",
              "shadow-sm"
            )}
          >
            Discussions
          </span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-border/40 bg-background/60 backdrop-blur-sm shadow-sm">
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 hover:bg-muted/50"
              title="More"
            >
              <MoreVertical className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Cover Image */}
          {taskData.cover && (
            <div className="relative h-48 w-full overflow-hidden group">
              <Image
                src={taskData.cover?.file.url || ""}
                alt="Task cover"
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-b from-background/20 to-transparent" />
            </div>
          )}

          <div className="p-6 space-y-8 -mt-4" id="details-section">
            {/* Title */}
            <TaskTitle
              title={taskData.title}
              onEdit={(newTitle) => handleEditTask({ title: newTitle })}
            />

            {/* Description */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                Description
              </h3>
              <TaskDescription
                description={taskData.description}
                onEdit={(newDescription) =>
                  handleEditTask({ description: newDescription })
                }
              />
            </div>

            {/* Status and Priority */}
            <div className="flex items-center gap-4">
              <div className="flex-1 space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Status
                </h3>
                <TaskStatusSelector
                  status={taskData.status}
                  onEdit={(newStatus) => handleEditTask({ status: newStatus })}
                />
              </div>
              <div className="flex-1 space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Priority
                </h3>
                <TaskPrioritySelector
                  priority={taskData.priority}
                  onEdit={(newPriority) =>
                    handleEditTask({ priority: newPriority })
                  }
                />
              </div>
            </div>

            {/* Timeline */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Timeline
                </h3>
              </div>

              <div className="space-y-3">
                <TaskTimeline
                  startDate={startDate}
                  dueDate={dueDate}
                  onEdit={(newStartDate, newDueDate) =>
                    handleEditTask({
                      startDate: newStartDate?.toISOString() || null,
                      dueDate: newDueDate?.toISOString() || null,
                    })
                  }
                />
              </div>
            </div>

            {/* Assignees */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Assignees
                </h3>
              </div>

              <div className="space-y-3">
                <TaskAssignee assignees={taskData.assignees} />
              </div>
            </div>
            {/* Checklists */}
            <TaskChecklistsSection taskId={taskData.id} />

            {/* Attachments */}
            <TaskAttachmentsSection taskId={taskData.id} />
            {/* Discussions */}
            <TaskDiscussionsSection taskId={taskData.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
