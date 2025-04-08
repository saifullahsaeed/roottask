"use client";

import { format } from "date-fns";
import {
  Calendar,
  Clock,
  Tag,
  ListChecks,
  MoreHorizontal,
  Plus,
  FileText,
  Link2,
  GitBranch,
  Edit2,
  ExternalLink,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui";
import { TaskPriority } from "@prisma/client";
import { MockTask } from "../types";
import { cn } from "@/lib/utils";

const priorityColors = {
  [TaskPriority.LOW]: {
    bg: "bg-emerald-50 dark:bg-emerald-500/10",
    text: "text-emerald-700 dark:text-emerald-400",
    border: "border-emerald-200 dark:border-emerald-500/20",
  },
  [TaskPriority.MEDIUM]: {
    bg: "bg-amber-50 dark:bg-amber-500/10",
    text: "text-amber-700 dark:text-amber-400",
    border: "border-amber-200 dark:border-amber-500/20",
  },
  [TaskPriority.HIGH]: {
    bg: "bg-orange-50 dark:bg-orange-500/10",
    text: "text-orange-700 dark:text-orange-400",
    border: "border-orange-200 dark:border-orange-500/20",
  },
  [TaskPriority.URGENT]: {
    bg: "bg-rose-50 dark:bg-rose-500/10",
    text: "text-rose-700 dark:text-rose-400",
    border: "border-rose-200 dark:border-rose-500/20",
  },
} as const;

const priorityLabels = {
  [TaskPriority.LOW]: "Low Priority",
  [TaskPriority.MEDIUM]: "Medium Priority",
  [TaskPriority.HIGH]: "High Priority",
  [TaskPriority.URGENT]: "Urgent Priority",
} as const;

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

interface TaskDetailsProps {
  task: MockTask;
}

export function TaskDetails({ task }: TaskDetailsProps) {
  return (
    <div className="flex-1 flex flex-col min-w-0 bg-background border-r">
      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-[1200px] mx-auto p-6 space-y-6">
          {/* Cover Image/Color */}
          {task.cover && (
            <div
              className="h-48 rounded-2xl overflow-hidden shadow-sm transition-transform hover:scale-[1.002]"
              style={{
                backgroundColor:
                  task.cover.type === "color" ? task.cover.value : undefined,
                backgroundImage:
                  task.cover.type === "image"
                    ? `url(${task.cover.value})`
                    : undefined,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
          )}

          {/* Quick Info Row */}
          <div className="flex items-center gap-4">
            {/* Priority */}
            <div className="flex items-center gap-2 group">
              <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                Priority
              </span>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "h-7 px-2.5 rounded-md border transition-all hover:shadow-sm",
                  priorityColors[task.priority].bg,
                  priorityColors[task.priority].text,
                  priorityColors[task.priority].border
                )}
              >
                <span className="text-sm font-medium">
                  {priorityLabels[task.priority]}
                </span>
                <ChevronDown className="w-3.5 h-3.5 ml-1 transition-transform group-hover:rotate-180" />
              </Button>
            </div>

            {/* Timeline */}
            <div className="flex items-center gap-2 group">
              <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                Timeline
              </span>
              <div className="flex items-center gap-2 h-7 px-2.5 rounded-md border bg-card hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-sm">
                    {task.startDate
                      ? format(task.startDate, "MMM d")
                      : "Not set"}
                  </span>
                </div>
                <span className="text-muted-foreground mx-1">→</span>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-sm">
                    {task.dueDate ? format(task.dueDate, "MMM d") : "Not set"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="flex items-center gap-2">
            {task.tags?.map((taskTag) => (
              <span
                key={taskTag.id}
                className="px-3 py-1.5 rounded-full text-sm font-medium transition-all hover:opacity-90 cursor-pointer hover:scale-105"
                style={{
                  backgroundColor: `${taskTag.tag.color}15`,
                  color: taskTag.tag.color,
                }}
              >
                {taskTag.tag.name}
              </span>
            ))}
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-3 hover:bg-muted/50 transition-colors"
            >
              <Tag className="w-4 h-4" />
            </Button>
          </div>

          {/* Description */}
          <div className="bg-card rounded-xl border shadow-sm hover:shadow-md transition-all overflow-hidden group">
            <div className="px-5 py-3.5 bg-muted/30">
              <h2 className="font-medium">Description</h2>
            </div>
            <div className="px-5 py-4">
              <p className="text-sm leading-relaxed whitespace-pre-wrap text-muted-foreground group-hover:text-foreground transition-colors">
                {task.description || "No description provided."}
              </p>
            </div>
          </div>

          {/* Checklists Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <h2 className="font-medium">Checklists</h2>
              <Button variant="outline" size="sm" className="h-9 gap-2">
                <ListChecks className="w-4 h-4" />
                New Checklist
              </Button>
            </div>

            {/* Multiple Checklists */}
            {task.checklist.map((list) => (
              <div
                key={list.id}
                className="bg-card rounded-xl border shadow-sm hover:shadow-md transition-all overflow-hidden"
              >
                <div className="px-5 py-3.5 bg-muted/30 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <h2 className="font-medium">{list.title}</h2>
                    <div className="text-sm px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                      {list.items.filter((item) => item.completed).length}/
                      {list.items.length}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-3 gap-2"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 px-3">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="p-3">
                  {list.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group"
                    >
                      <input
                        type="checkbox"
                        checked={item.completed}
                        className="mt-1"
                        onChange={() => {}}
                      />
                      <span
                        className={cn(
                          "text-sm",
                          item.completed && "line-through text-muted-foreground"
                        )}
                      >
                        {item.title}
                      </span>
                    </div>
                  ))}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full mt-1 h-9 text-sm text-muted-foreground hover:text-foreground gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Item
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Attachments */}
          <div className="bg-card rounded-xl border shadow-sm hover:shadow-md transition-all overflow-hidden group">
            <div className="px-5 py-3.5 bg-muted/30 flex items-center justify-between">
              <h2 className="font-medium">Attachments</h2>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-3 gap-2 hover:bg-muted/50 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add File
              </Button>
            </div>
            <div className="p-3">
              {task.attachments && task.attachments.length > 0 ? (
                <div className="space-y-1">
                  {task.attachments.map((attachment) => (
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
                            {attachment.name}
                          </span>
                          <span className="text-xs text-muted-foreground font-medium">
                            {Math.round(attachment.size / 1024)}kb
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                          <div className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-medium">
                            {getInitials(attachment.uploadedBy.name)}
                          </div>
                          <span>
                            {attachment.uploadedBy.name} •{" "}
                            {format(attachment.uploadedAt, "MMM d, yyyy")}
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
                  ))}
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

          {/* Dependencies */}
          <div className="bg-card rounded-xl border shadow-sm hover:shadow-md transition-all overflow-hidden group">
            <div className="px-5 py-3.5 bg-muted/30 flex items-center justify-between">
              <h2 className="font-medium">Dependencies</h2>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-3 gap-2 hover:bg-muted/50 transition-colors"
              >
                <Link2 className="w-4 h-4" />
                Link Task
              </Button>
            </div>
            <div className="divide-y">
              {/* Blocking Tasks */}
              <div className="p-5">
                <span className="text-sm font-medium text-muted-foreground">
                  Blocking
                </span>
                {task.blockingTasks && task.blockingTasks.length > 0 ? (
                  <div className="mt-3 space-y-1">
                    {task.blockingTasks.map((dependency) => (
                      <div
                        key={dependency.id}
                        className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted/50 transition-colors group/item"
                      >
                        <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center group-hover/item:scale-105 transition-transform">
                          <GitBranch className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-medium">
                          {dependency.title}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mt-2 text-sm text-muted-foreground">
                    Not blocking any tasks
                  </div>
                )}
              </div>
              {/* Blocked By Tasks */}
              <div className="p-5">
                <span className="text-sm font-medium text-muted-foreground">
                  Blocked By
                </span>
                {task.blockedByTasks && task.blockedByTasks.length > 0 ? (
                  <div className="mt-3 space-y-1">
                    {task.blockedByTasks.map((dependency) => (
                      <div
                        key={dependency.id}
                        className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted/50 transition-colors group/item"
                      >
                        <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center group-hover/item:scale-105 transition-transform">
                          <GitBranch className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-medium">
                          {dependency.title}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mt-2 text-sm text-muted-foreground">
                    Not blocked by any tasks
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Parent/Child Tasks */}
          {(task.parentTask ||
            (task.childTasks && task.childTasks.length > 0)) && (
            <div className="bg-card rounded-xl border shadow-sm hover:shadow-md transition-all overflow-hidden">
              <div className="px-5 py-3.5 bg-muted/30">
                <h2 className="font-medium">Related Tasks</h2>
              </div>
              <div className="divide-y">
                {task.parentTask && (
                  <div className="p-5">
                    <span className="text-sm font-medium text-muted-foreground">
                      Parent Task
                    </span>
                    <div className="mt-3 flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                        <GitBranch className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-medium">
                        {task.parentTask.title}
                      </span>
                    </div>
                  </div>
                )}
                {task.childTasks && task.childTasks.length > 0 && (
                  <div className="p-5">
                    <span className="text-sm font-medium text-muted-foreground">
                      Sub Tasks
                    </span>
                    <div className="mt-3 space-y-1">
                      {task.childTasks.map((childTask) => (
                        <div
                          key={childTask.id}
                          className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                            <GitBranch className="w-4 h-4" />
                          </div>
                          <span className="text-sm font-medium">
                            {childTask.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
