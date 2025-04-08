import { TaskWithRelations } from "@/types";
import { CheckCircle2, Pencil, Trash2, Calendar, Users } from "lucide-react";
import { PriorityBadge } from "@/components/priority_badge/PriorityBadge";
import { format } from "date-fns";
import { Tooltip } from "@/components/ui/tooltip/tooltip";
import { DraggableProvided } from "@hello-pangea/dnd";

interface TaskCardProps {
  task: TaskWithRelations;
  onClick?: () => void;
  draggableProps?: DraggableProvided;
}

export default function TaskCard({
  task,
  onClick,
  draggableProps,
}: TaskCardProps) {
  return (
    <div
      className="w-full bg-card rounded-lg p-2 flex flex-col gap-1 mb-2 hover:shadow-md transition-all group relative cursor-pointer"
      onClick={onClick}
      ref={draggableProps?.innerRef}
      {...draggableProps?.draggableProps}
      {...draggableProps?.dragHandleProps}
      role="button"
      tabIndex={0}
      aria-label={`Task: ${task.title}`}
    >
      {/* Action Menu - Top Right Corner */}
      <div
        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 bg-background/95 shadow-sm rounded-lg p-1 z-10 border border-border"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="p-1 hover:bg-green-100 rounded-lg transition-colors text-green-600"
          aria-label="Complete task"
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
        </button>
        <button
          className="p-1 hover:bg-blue-100 rounded-lg transition-colors text-blue-600"
          aria-label="Edit task"
        >
          <Pencil className="w-3.5 h-3.5" />
        </button>
        <button
          className="p-1 hover:bg-red-100 rounded-lg transition-colors text-red-600"
          aria-label="Delete task"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Title and Description Tooltip */}
      <Tooltip
        content={
          <div className="flex flex-col gap-2 max-w-xs">
            <div className="font-medium whitespace-normal">{task.title}</div>
            {task.description && (
              <div className="text-xs text-muted-foreground whitespace-normal">
                {task.description}
              </div>
            )}
            <div className="text-xs mt-1 pt-1 border-t border-border/50">
              Created: {format(new Date(task.createdAt), "MMM d, yyyy")}
            </div>
          </div>
        }
        variant="dark"
        side="top"
        delayDuration={500}
      >
        <div className="flex flex-col gap-1">
          <div className="text-sm font-medium pr-16 line-clamp-2 group-hover:text-primary transition-colors">
            {task.title}
          </div>
          {task.description && task.description.trim() !== "" && (
            <div className="text-xs text-muted-foreground line-clamp-1">
              {task.description}
            </div>
          )}
        </div>
      </Tooltip>

      {/* Assignees */}
      {task.assignments && task.assignments.length > 0 && (
        <Tooltip
          content={
            <div className="flex flex-col gap-2 min-w-[200px]">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span className="font-medium">Assignees</span>
              </div>
              <div className="flex flex-col gap-1.5">
                {task.assignments.map((assignment) => (
                  <div key={assignment.id} className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs">
                      {assignment.teamMember?.user?.name?.charAt(0) || "?"}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">
                        {assignment.teamMember?.user?.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {assignment.teamMember?.user?.email}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          }
          variant="dark"
          side="top"
          delayDuration={500}
        >
          <div className="flex -space-x-2" onClick={(e) => e.stopPropagation()}>
            {task.assignments.map((assignment) => (
              <div
                key={assignment.id}
                className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-xs border-2 border-background hover:ring-2 hover:ring-primary/20 transition-all"
              >
                {assignment.teamMember?.user?.name?.charAt(0) || "?"}
              </div>
            ))}
          </div>
        </Tooltip>
      )}

      {/* Footer with Dates and Priority */}
      <div className="flex items-center justify-between mt-1">
        {/* Dates */}
        {(task.startDate || task.dueDate) && (
          <Tooltip
            content={
              <div className="flex flex-col gap-2 min-w-[180px]">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span className="font-medium">Timeline</span>
                </div>
                <div className="flex flex-col gap-1.5">
                  {task.startDate && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Start</span>
                      <span className="text-sm font-medium">
                        {format(new Date(task.startDate), "MMM d, yyyy")}
                      </span>
                    </div>
                  )}
                  {task.dueDate && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Due</span>
                      <span className="text-sm font-medium">
                        {format(new Date(task.dueDate), "MMM d, yyyy")}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            }
            variant="primary"
            side="bottom"
            delayDuration={500}
          >
            <div
              className="flex items-center gap-1 text-xs text-muted-foreground"
              onClick={(e) => e.stopPropagation()}
            >
              <Calendar className="w-3 h-3" />
              {task.startDate && format(new Date(task.startDate), "MMM d")}
              {task.startDate && task.dueDate && " - "}
              {task.dueDate && format(new Date(task.dueDate), "MMM d")}
            </div>
          </Tooltip>
        )}

        {/* Priority Badge */}
        {task.priority && (
          <Tooltip
            content={
              <div className="flex flex-col gap-2 min-w-[180px]">
                <div className="flex items-center gap-2">
                  <PriorityBadge priority={task.priority} />
                  <span className="font-medium">Priority Details</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {task.priority === "URGENT" &&
                    "This task requires immediate attention and should be addressed as soon as possible."}
                  {task.priority === "HIGH" &&
                    "This task should be completed soon to maintain project momentum."}
                  {task.priority === "MEDIUM" &&
                    "This task has normal priority and should be completed within the planned timeline."}
                  {task.priority === "LOW" &&
                    "This task can be completed when convenient, without impacting other priorities."}
                </div>
              </div>
            }
            variant="secondary"
            side="bottom"
            delayDuration={500}
          >
            <div
              className="flex items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <PriorityBadge priority={task.priority} />
            </div>
          </Tooltip>
        )}
      </div>
    </div>
  );
}
