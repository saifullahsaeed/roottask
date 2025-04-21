import { Node } from "reactflow";
import {
  ChevronLeft,
  MoreVertical,
  Edit2,
  Plus,
  FileText,
  ExternalLink,
  Check,
  CheckCircle2,
  Circle,
  Trash2,
  Activity,
  ListChecks,
  Paperclip,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  Task,
  TaskChecklist,
  TaskAttachment,
  TaskChecklistItem,
  File,
} from "@prisma/client";
import TaskTitle from "@/components/flow/components/task_details/title";
import { useFlowStore } from "./store/useFlowStore";
import TaskDescription from "@/components/flow/components/task_details/description";
import TaskStatusSelector from "@/components/flow/components/task_details/status";
import TaskPrioritySelector from "./components/task_details/priority";
import TaskTimeline from "./components/task_details/timeline";
import TaskAssignee from "./components/task_details/assignee";

interface TaskDetailsProps {
  node: Node | null;
  taskflowId: string;
  onClose: () => void;
}

interface TaskChecklistWithItems extends TaskChecklist {
  items: TaskChecklistItem[];
}

interface TaskAttachmentWithFile extends TaskAttachment {
  file: File;
}

interface TaskDetailsType extends Task {
  cover: TaskAttachmentWithFile;
  assignees: {
    id: string;
    user: {
      id: string;
      name: string;
      image?: string | null;
    };
  }[];
  attachments: TaskAttachmentWithFile[];
  checklists: TaskChecklistWithItems[];
  flowId: string;
}

interface Activity {
  id: string;
  type: "comment" | "update" | "attachment";
  user: {
    name: string;
    avatar: string;
  };
  content: string;
  timestamp: Date;
}

export function TaskDetails({ node, onClose, taskflowId }: TaskDetailsProps) {
  const { updateNode } = useFlowStore();
  const queryClient = useQueryClient();
  const { data: taskData, isLoading } = useQuery<TaskDetailsType>({
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

  function getInitials(name: string) {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }

  // Add sample activity data
  const activityData: Activity[] = [];

  return (
    <div className="h-full flex bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-lg shadow-black/5">
      {/* Sidebar */}
      <div className="w-12 border-r border-border/40 bg-background/80 backdrop-blur flex flex-col items-center py-2 gap-1">
        <button
          onClick={onClose}
          className="inline-flex items-center justify-center w-8 h-8 rounded-md hover:bg-muted/50 transition-colors"
          title="Close"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div className="h-px w-8 bg-border/40 my-1" />
        <button
          className="w-8 h-8 rounded-md hover:bg-muted/50 transition-colors flex items-center justify-center"
          title="Details"
        >
          <FileText className="w-4 h-4" />
        </button>
        <button
          className="w-8 h-8 rounded-md hover:bg-muted/50 transition-colors flex items-center justify-center"
          title="Activity"
        >
          <Activity className="w-4 h-4" />
        </button>
        <button
          className="w-8 h-8 rounded-md hover:bg-muted/50 transition-colors flex items-center justify-center"
          title="Checklists"
        >
          <ListChecks className="w-4 h-4" />
        </button>
        <button
          className="w-8 h-8 rounded-md hover:bg-muted/50 transition-colors flex items-center justify-center"
          title="Attachments"
        >
          <Paperclip className="w-4 h-4" />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-border/40 bg-background/60 backdrop-blur-sm shadow-sm">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="relative h-7 w-7 hover:bg-muted/50 group"
              title="Chat"
            >
              <MessageCircle className="h-3.5 w-3.5 transition-transform group-hover:scale-110" />
              <Badge
                variant="default"
                className="absolute -right-1 -top-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]"
              >
                3
              </Badge>
            </Button>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 hover:bg-muted/50"
              title="Edit"
            >
              <Edit2 className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 hover:bg-muted/50"
              title="Delete"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
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

          <div className="p-6 space-y-8 -mt-4">
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
                <TaskAssignee
                  assignees={taskData.assignees}
                  onEdit={(newAssignees: { id: string; userId: string }[]) => {
                    // TODO: Implement assignee update
                    console.log("Update assignees:", newAssignees);
                  }}
                />
              </div>
            </div>

            {/* Activity */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                Recent Activity
              </h3>
              <div className="space-y-3">
                {activityData.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={activity.user.avatar} />
                      <AvatarFallback>
                        {getInitials(activity.user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          {activity.user.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {activity.type === "comment" && "commented"}
                          {activity.type === "update" && "updated"}
                          {activity.type === "attachment" &&
                            "added an attachment"}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(activity.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm mt-1">{activity.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Checklists */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Checklists
                </h3>
                <Button variant="outline" size="sm" className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add Checklist
                </Button>
              </div>

              {taskData.checklists?.map((checklist: TaskChecklistWithItems) => (
                <div
                  key={checklist.id}
                  className="bg-card rounded-xl border shadow-sm hover:shadow-md transition-all overflow-hidden group"
                >
                  <div className="px-5 py-3.5 bg-muted/30 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{checklist.content}</h3>
                      <span className="text-sm text-muted-foreground">
                        {
                          checklist.items.filter((item) => item.completed)
                            .length
                        }{" "}
                        of {checklist.items.length} completed
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-3 gap-2 hover:bg-muted/50 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Add Item
                    </Button>
                  </div>
                  <div className="p-3">
                    {checklist.items.length > 0 ? (
                      <div className="space-y-1">
                        {checklist.items.map((item: TaskChecklistItem) => (
                          <div
                            key={item.id}
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group/item"
                          >
                            <button className="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors group-hover/item:border-primary">
                              {item.completed ? (
                                <CheckCircle2 className="w-4 h-4 text-primary" />
                              ) : (
                                <Circle className="w-4 h-4 text-muted-foreground" />
                              )}
                            </button>
                            <span
                              className={`text-sm flex-1 ${
                                item.completed
                                  ? "line-through text-muted-foreground"
                                  : ""
                              }`}
                            >
                              {item.content}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 opacity-0 group-hover/item:opacity-100 transition-opacity hover:bg-muted/50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-8 text-center">
                        <div className="w-12 h-12 rounded-full bg-muted/30 text-muted-foreground flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                          <Check className="w-6 h-6" />
                        </div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">
                          No items in this checklist
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Add items to break down your task
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {!taskData.checklists ||
                (taskData.checklists.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-16 h-16 rounded-full bg-muted/30 text-muted-foreground flex items-center justify-center mb-4">
                      <Check className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">
                      No checklists yet
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Create a checklist to break down your task into smaller
                      steps
                    </p>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Plus className="w-4 h-4" />
                      Create Checklist
                    </Button>
                  </div>
                ))}
            </div>

            {/* Attachments */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Attachments
                </h3>
                <Button variant="outline" size="sm" className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add File
                </Button>
              </div>

              {taskData.attachments && taskData.attachments.length > 0 ? (
                <div className="space-y-1">
                  {taskData.attachments.map(
                    (attachment: TaskAttachmentWithFile) => (
                      <div
                        key={attachment.id}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group/item"
                      >
                        <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center group-hover/item:scale-105 transition-transform">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium truncate">
                              {attachment.file.name}
                            </span>
                            <span className="text-xs text-muted-foreground font-medium">
                              {Math.round(attachment.file.size || 0 / 1024)}kb
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                            <div className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-medium">
                              {getInitials("N")}
                            </div>
                            <span>
                              {attachment.userId} •{" "}
                              {new Date(
                                attachment.createdAt
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 opacity-0 group-hover/item:opacity-100 transition-opacity hover:bg-muted/50"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                    )
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="w-12 h-12 rounded-full bg-muted/30 text-muted-foreground flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    <FileText className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    No attachments yet
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Drop files here or click to upload
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
