import { Node } from "reactflow";
import { TaskType } from "./types/flow.types";
import { Calendar, Clock, Check, Flag, Users, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface TaskDetailsProps {
  node: Node<TaskType> | null;
  onClose: () => void;
}

export function TaskDetails({ node, onClose }: TaskDetailsProps) {
  if (!node) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-muted-foreground">Select a card to view details</p>
      </div>
    );
  }

  const formattedDate = node.data.dueDate
    ? new Date(node.data.dueDate).toLocaleDateString()
    : null;

  const isPastDue =
    node.data.dueDate && new Date(node.data.dueDate) < new Date();
  const isToday =
    node.data.dueDate &&
    new Date(node.data.dueDate).toDateString() === new Date().toDateString();

  return (
    <div className="h-full flex flex-col bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-lg shadow-black/5">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border/40 bg-background/80 backdrop-blur shadow-sm">
        <h2 className="text-lg font-semibold">Task Details</h2>
        <button
          onClick={onClose}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-sm text-muted-foreground hover:bg-muted/50 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Hide
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-8">
          {/* Title Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Title
            </h3>
            <p className="text-lg font-medium leading-relaxed">
              {node.data.title}
            </p>
          </div>

          {/* Status and Priority Row */}
          <div className="flex items-center gap-4">
            {node.data.status && (
              <div className="flex-1 space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  Status
                </h3>
                <div
                  className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium border",
                    node.data.status === "TODO"
                      ? "text-gray-500 bg-gray-500/10 border-gray-500/20"
                      : node.data.status === "IN_PROGRESS"
                      ? "text-blue-500 bg-blue-500/10 border-blue-500/20"
                      : "text-green-500 bg-green-500/10 border-green-500/20"
                  )}
                >
                  {node.data.status === "IN_PROGRESS" ? (
                    <Clock className="w-4 h-4" />
                  ) : node.data.status === "COMPLETED" ? (
                    <Check className="w-4 h-4" />
                  ) : null}
                  {node.data.status}
                </div>
              </div>
            )}
            {node.data.priority && (
              <div className="flex-1 space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  Priority
                </h3>
                <div
                  className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium border",
                    node.data.priority === "HIGH"
                      ? "text-red-500 bg-red-500/10 border-red-500/20"
                      : node.data.priority === "MEDIUM"
                      ? "text-yellow-500 bg-yellow-500/10 border-yellow-500/20"
                      : "text-green-500 bg-green-500/10 border-green-500/20"
                  )}
                >
                  <Flag className="w-4 h-4" />
                  {node.data.priority}
                </div>
              </div>
            )}
          </div>

          {/* Due Date */}
          {formattedDate && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Due Date
              </h3>
              <div
                className={cn(
                  "flex items-center gap-2 text-base",
                  isPastDue
                    ? "text-red-500"
                    : isToday
                    ? "text-primary"
                    : "text-foreground"
                )}
              >
                {isPastDue ? (
                  <Clock className="w-5 h-5" />
                ) : (
                  <Calendar className="w-5 h-5" />
                )}
                <span>{formattedDate}</span>
              </div>
            </div>
          )}

          {/* Assignees */}
          {node.data.assignees && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Assignees
              </h3>
              <div className="flex flex-wrap gap-3">
                {Array.isArray(node.data.assignees)
                  ? node.data.assignees.map((assignee) => (
                      <div
                        key={assignee.id}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium border border-border/40 bg-muted/50"
                      >
                        <Users className="w-4 h-4 text-muted-foreground" />
                        {assignee.name}
                      </div>
                    ))
                  : node.data.assignees}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
