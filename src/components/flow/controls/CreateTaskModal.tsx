import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Button,
} from "@/components/ui";
import { ArrowRight, AlertCircle, ChevronDown } from "lucide-react";
import { useFlowStore } from "../store/useFlowStore";
import { TaskPriority, TaskStatus } from "@prisma/client";
import { cn } from "@/lib/utils";
import { v4 as uuidv4 } from "uuid";
import { EDGE_TYPES } from "../edges/EdgeTypes";
import {
  createNodeInBackground,
  createNodeWithEdgesInBackground,
} from "../bi/tasks";
import { getNextCardPosition } from "./nextCardposition";
import { TaskForNode } from "@/types";
import { Edge } from "reactflow";

const priorityOptions: { value: TaskPriority; label: string }[] = [
  { value: "LOW", label: "Low" },
  { value: "MEDIUM", label: "Medium" },
  { value: "HIGH", label: "High" },
  { value: "CRITICAL", label: "Critical" },
  { value: "BLOCKER", label: "Blocker" },
];

const priorityColors: Record<
  TaskPriority,
  {
    bg: string;
    text: string;
    border: string;
    hover: string;
  }
> = {
  LOW: {
    bg: "bg-gray-100/50 dark:bg-gray-800/50",
    text: "text-gray-600 dark:text-gray-400",
    border: "border-gray-200 dark:border-gray-700",
    hover: "hover:bg-gray-100 dark:hover:bg-gray-800",
  },
  MEDIUM: {
    bg: "bg-blue-100/50 dark:bg-blue-900/50",
    text: "text-blue-600 dark:text-blue-400",
    border: "border-blue-200 dark:border-blue-800",
    hover: "hover:bg-blue-100 dark:hover:bg-blue-900",
  },
  HIGH: {
    bg: "bg-orange-100/50 dark:bg-orange-900/50",
    text: "text-orange-600 dark:text-orange-400",
    border: "border-orange-200 dark:border-orange-800",
    hover: "hover:bg-orange-100 dark:hover:bg-orange-900",
  },
  CRITICAL: {
    bg: "bg-red-100/50 dark:bg-red-900/50",
    text: "text-red-600 dark:text-red-400",
    border: "border-red-200 dark:border-red-800",
    hover: "hover:bg-red-100 dark:hover:bg-red-900",
  },
  BLOCKER: {
    bg: "bg-purple-100/50 dark:bg-purple-900/50",
    text: "text-purple-600 dark:text-purple-400",
    border: "border-purple-200 dark:border-purple-800",
    hover: "hover:bg-purple-100 dark:hover:bg-purple-900",
  },
};

const defaultPriorityStyle = {
  bg: "bg-transparent",
  text: "text-gray-500 dark:text-gray-400",
  border: "border-gray-200 dark:border-gray-700",
  hover: "hover:bg-gray-50 dark:hover:bg-gray-800/50",
};

const statusOptions: { value: TaskStatus; label: string }[] = [
  { value: "TODO", label: "To Do" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "COMPLETED", label: "Completed" },
];

const statusColors = {
  TODO: {
    bg: "bg-gray-100/50 dark:bg-gray-800/50",
    text: "text-gray-600 dark:text-gray-400",
    border: "border-gray-200 dark:border-gray-700",
    hover: "hover:bg-gray-100 dark:hover:bg-gray-800",
  },
  IN_PROGRESS: {
    bg: "bg-blue-100/50 dark:bg-blue-900/50",
    text: "text-blue-600 dark:text-blue-400",
    border: "border-blue-200 dark:border-blue-800",
    hover: "hover:bg-blue-100 dark:hover:bg-blue-900",
  },
  COMPLETED: {
    bg: "bg-green-100/50 dark:bg-green-900/50",
    text: "text-green-600 dark:text-green-400",
    border: "border-green-200 dark:border-green-800",
    hover: "hover:bg-green-100 dark:hover:bg-green-900",
  },
};

interface PrioritySelectProps {
  value: TaskPriority | null;
  onChange: (value: TaskPriority | null) => void;
}

function PrioritySelect({ value, onChange }: PrioritySelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  const currentStyle = value ? priorityColors[value] : defaultPriorityStyle;

  return (
    <div className="relative w-full">
      <button
        className={cn(
          "flex items-center justify-between w-full px-3 py-2 rounded-md",
          "border transition-all duration-200",
          "outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          "hover:scale-[1.02] active:scale-[0.98]",
          currentStyle.bg,
          currentStyle.text,
          currentStyle.border,
          currentStyle.hover,
          "group"
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          {value && (
            <div
              className={cn(
                "w-2 h-2 rounded-full",
                value ? priorityColors[value].bg : defaultPriorityStyle.bg,
                value
                  ? priorityColors[value].border
                  : defaultPriorityStyle.border
              )}
            />
          )}
          <span className="text-sm font-medium">
            {value
              ? priorityOptions.find((opt) => opt.value === value)?.label
              : "Set Priority"}
          </span>
        </div>
        <ChevronDown
          className={cn(
            "w-4 h-4 transition-transform duration-200",
            isOpen && "rotate-180",
            "opacity-60 group-hover:opacity-100"
          )}
        />
      </button>

      {isOpen && (
        <div
          className={cn(
            "absolute top-full left-0 right-0 mt-1",
            "bg-white dark:bg-gray-800",
            "rounded-md shadow-lg",
            "border border-gray-200 dark:border-gray-700",
            "z-10",
            "animate-in fade-in zoom-in-95 duration-200",
            "overflow-hidden"
          )}
        >
          <button
            className={cn(
              "w-full px-3 py-2 text-left text-sm",
              "transition-colors duration-200",
              "hover:bg-muted/50",
              !value && "font-medium",
              defaultPriorityStyle.text,
              defaultPriorityStyle.hover,
              "flex items-center gap-2"
            )}
            onClick={() => {
              onChange(null);
              setIsOpen(false);
            }}
          >
            <div
              className={cn(
                "w-2 h-2 rounded-full",
                defaultPriorityStyle.bg,
                defaultPriorityStyle.border
              )}
            />
            No Priority
          </button>
          {priorityOptions.map((option) => (
            <button
              key={option.value}
              className={cn(
                "w-full px-3 py-2 text-left text-sm",
                "transition-colors duration-200",
                "hover:bg-muted/50",
                value === option.value && "font-medium",
                priorityColors[option.value].text,
                priorityColors[option.value].hover,
                "flex items-center gap-2"
              )}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
            >
              <div
                className={cn(
                  "w-2 h-2 rounded-full",
                  priorityColors[option.value].bg,
                  priorityColors[option.value].border
                )}
              />
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

interface StatusSelectProps {
  value: TaskStatus | null;
  onChange: (value: TaskStatus) => void;
}

function StatusSelect({ value, onChange }: StatusSelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative w-full">
      <button
        className={cn(
          "flex items-center justify-between w-full px-3 py-2 rounded-md",
          "border transition-all duration-200",
          "outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          "hover:scale-[1.02] active:scale-[0.98]",
          value && [
            statusColors[value].bg,
            statusColors[value].text,
            statusColors[value].border,
            statusColors[value].hover,
          ],
          !value && [
            "bg-accent/20",
            "text-muted-foreground",
            "hover:bg-accent/30",
          ],
          "group"
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          {value && (
            <div
              className={cn(
                "w-2 h-2 rounded-full",
                statusColors[value].bg,
                statusColors[value].border
              )}
            />
          )}
          <span className="text-sm font-medium">
            {value
              ? statusOptions.find((opt) => opt.value === value)?.label
              : "Set Status"}
          </span>
        </div>
        <ChevronDown
          className={cn(
            "w-4 h-4 transition-transform duration-200",
            isOpen && "rotate-180",
            "opacity-60 group-hover:opacity-100"
          )}
        />
      </button>

      {isOpen && (
        <div
          className={cn(
            "absolute top-full left-0 right-0 mt-1",
            "bg-white dark:bg-gray-800",
            "rounded-md shadow-lg",
            "border border-gray-200 dark:border-gray-700",
            "z-10",
            "animate-in fade-in zoom-in-95 duration-200",
            "overflow-hidden"
          )}
        >
          {statusOptions.map((option) => (
            <button
              key={option.value}
              className={cn(
                "w-full px-3 py-2 text-left text-sm",
                "transition-colors duration-200",
                "hover:bg-muted/50",
                value === option.value && "font-medium",
                statusColors[option.value].text,
                statusColors[option.value].hover,
                "flex items-center gap-2"
              )}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
            >
              <div
                className={cn(
                  "w-2 h-2 rounded-full",
                  statusColors[option.value].bg,
                  statusColors[option.value].border
                )}
              />
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

interface ConnectionTypeSelectProps {
  value: string | null;
  onChange: (value: string) => void;
}

function ConnectionTypeSelect({ value, onChange }: ConnectionTypeSelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  const connectionTypes = [
    {
      value: EDGE_TYPES.NEXT_TASK,
      label: "Next Task",
      icon: ArrowRight,
      className: "text-primary",
    },
    {
      value: EDGE_TYPES.OPTIONAL_NEXT,
      label: "Optional Next",
      icon: ArrowRight,
      className: "text-primary opacity-50",
    },
    {
      value: EDGE_TYPES.BLOCKED,
      label: "Blocked Task",
      icon: AlertCircle,
      className: "text-destructive",
    },
  ];

  return (
    <div className="relative w-full">
      <button
        className={cn(
          "flex items-center justify-between w-full px-3 py-2 rounded-md",
          "border transition-all duration-200",
          "outline-none focus:ring-0",
          value
            ? "bg-primary/10 text-primary border-primary/20"
            : "bg-accent/20 text-muted-foreground hover:bg-accent/30",
          "group"
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-sm font-medium">
          {value
            ? connectionTypes.find((type) => type.value === value)?.label
            : "Connection Type"}
        </span>
        <ChevronDown
          className={cn(
            "w-4 h-4 transition-transform duration-200",
            isOpen && "rotate-180",
            "opacity-60 group-hover:opacity-100"
          )}
        />
      </button>

      {isOpen && (
        <div
          className={cn(
            "absolute top-full left-0 right-0 mt-1",
            "bg-white dark:bg-gray-800",
            "rounded-md shadow-lg",
            "border border-gray-200 dark:border-gray-700",
            "z-10",
            "animate-in fade-in zoom-in-95 duration-200"
          )}
        >
          {connectionTypes.map((type) => {
            const Icon = type.icon;
            return (
              <button
                key={type.value}
                className={cn(
                  "w-full px-3 py-2 text-left text-sm",
                  "transition-colors duration-200",
                  "first:rounded-t-md last:rounded-b-md",
                  value === type.value && "font-medium",
                  "flex items-center gap-2",
                  "hover:bg-primary/10"
                )}
                onClick={() => {
                  onChange(type.value);
                  setIsOpen(false);
                }}
              >
                <Icon className={cn("w-4 h-4", type.className)} />
                {type.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function CreateTaskModal({
  opened,
  onClose,
  sourceNodeId,
  initialConnectionType,
}: {
  opened: boolean;
  onClose: () => void;
  sourceNodeId?: string;
  initialConnectionType?: string;
}) {
  const { addNode, taskFlowId, setEdges, edges, nodes } = useFlowStore();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TaskPriority | null>(null);
  const [status, setStatus] = useState<TaskStatus>(TaskStatus.TODO);
  const [connectionType, setConnectionType] = useState<string | null>(null);

  // Update connection type when initialConnectionType changes
  useEffect(() => {
    if (opened && initialConnectionType) {
      setConnectionType(initialConnectionType);
    }
  }, [opened, initialConnectionType]);

  const handleCreateTask = () => {
    if (!title) return;
    const newNodeId = `node-${uuidv4()}`;
    const newNode: TaskForNode = {
      id: `task-${uuidv4()}`,
      title,
      description,
      priority: priority || null,
      status: status || TaskStatus.TODO,
      startDate: null,
      dueDate: null,
      assigneesIds: [],
      coverId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (sourceNodeId) {
      const parentNode = nodes.find((node) => node.id === sourceNodeId);
      if (!parentNode) {
        return; // Do nothing if parent doesn't exist
      }
      const nextCardPosition = getNextCardPosition(sourceNodeId);
      addNode(newNodeId, newNode, "card", nextCardPosition);
    } else {
      addNode(newNodeId, newNode, "card", { x: 100, y: 100 });
    }

    if (!sourceNodeId) {
      createNodeInBackground({
        id: newNodeId,
        taskFlowId: taskFlowId,
        node: {
          id: newNodeId,
          type: "card",
          position: { x: 100, y: 100 },
          data: newNode,
        },
      });
    }
    // If there's a source node and connection type is selected, create the connection
    if (sourceNodeId && connectionType && newNode.id) {
      const nextCardPosition = getNextCardPosition(sourceNodeId);
      // Define edge styles based on connection type
      const getEdgeStyle = (type: string): React.CSSProperties => {
        switch (type) {
          case EDGE_TYPES.NEXT_TASK:
            return {
              stroke: "#2563eb", // Blue for next task
              strokeWidth: 2,
              strokeLinecap: "round" as const,
              strokeLinejoin: "round" as const,
            };
          case EDGE_TYPES.OPTIONAL_NEXT:
            return {
              stroke: "#64748b", // Gray for optional
              strokeWidth: 2,
              strokeLinecap: "round" as const,
              strokeLinejoin: "round" as const,
              strokeDasharray: "5,5", // Dashed line for optional
            };
          case EDGE_TYPES.BLOCKED:
            return {
              stroke: "#dc2626", // Red for blocked
              strokeWidth: 2,
              strokeLinecap: "round" as const,
              strokeLinejoin: "round" as const,
              strokeDasharray: "3,3", // Different dash pattern for blocked
            };
          default:
            return {
              stroke: "#000",
              strokeWidth: 2,
              strokeLinecap: "round" as const,
              strokeLinejoin: "round" as const,
            };
        }
      };

      // Create a connection object that matches ReactFlow's Edge type
      const newEdge: Edge = {
        id: `edge-${uuidv4()}`,
        source: sourceNodeId,
        target: newNodeId,
        sourceHandle: null,
        targetHandle: null,
        type: connectionType,
        style: getEdgeStyle(connectionType),
      };
      // Add the edge to the store
      setEdges([...edges, newEdge]);
      createNodeWithEdgesInBackground({
        taskFlowId: taskFlowId,
        node: {
          id: newNodeId,
          type: "card",
          position: nextCardPosition,
          data: newNode,
        },
        edges: [
          {
            source: sourceNodeId,
            target: newNodeId,
            type: connectionType,
            id: newEdge.id,
            style: newEdge.style,
          },
        ],
      });
    }
    onClose();
    resetForm();
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPriority(null);
    setStatus(TaskStatus.TODO);
    setConnectionType(null);
  };

  return (
    <Dialog
      open={opened}
      onOpenChange={(open) => {
        if (!open) {
          resetForm();
          onClose();
        }
      }}
    >
      <DialogContent className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-border p-0 gap-0 max-w-xl">
        <DialogHeader className="px-5 pt-4 pb-3 border-b border-border/50">
          <DialogTitle className="text-base font-semibold">
            {sourceNodeId ? "Create Connected Task" : "Create Task"}
          </DialogTitle>
        </DialogHeader>

        <div className="px-5 py-4 space-y-4">
          {/* Title Input */}
          <div className="space-y-2">
            <div className="flex items-center gap-1">
              <label className="text-sm font-medium text-muted-foreground">
                Task Title
              </label>
              <span className="text-xs text-destructive">*</span>
            </div>
            <textarea
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              className={cn(
                "w-full min-h-[70px] p-3 rounded-md border bg-background text-sm font-medium resize-none",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                "transition-all duration-200",
                "placeholder:text-muted-foreground/60",
                !title && "border-destructive/50"
              )}
              rows={2}
              autoFocus
            />
            {!title && (
              <p className="text-xs text-destructive mt-1">
                Task title is required
              </p>
            )}
          </div>

          {/* Priority and Status Row */}
          <div className="flex items-center gap-3">
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-1">
                <label className="text-sm font-medium text-muted-foreground">
                  Priority
                </label>
                <span className="text-xs text-muted-foreground">
                  (optional)
                </span>
              </div>
              <PrioritySelect value={priority} onChange={setPriority} />
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-1">
                <label className="text-sm font-medium text-muted-foreground">
                  Status
                </label>
                <span className="text-xs text-muted-foreground">
                  (optional)
                </span>
              </div>
              <StatusSelect value={status} onChange={setStatus} />
            </div>
          </div>

          {/* Connection Type (only shown when creating from a source node) */}
          {sourceNodeId && (
            <div className="space-y-2">
              <div className="flex items-center gap-1">
                <label className="text-sm font-medium text-muted-foreground">
                  Connection Type
                </label>
                <span className="text-xs text-destructive">*</span>
              </div>
              <ConnectionTypeSelect
                value={connectionType}
                onChange={setConnectionType}
              />
              {!connectionType && (
                <p className="text-xs text-destructive mt-1">
                  Connection type is required
                </p>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-4 border-t border-border/50">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                resetForm();
                onClose();
              }}
              className="px-4 text-sm font-medium hover:bg-muted/50 transition-colors"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateTask}
              disabled={Boolean(!title || (sourceNodeId && !connectionType))}
              size="sm"
              className="px-4 text-sm font-medium transition-colors"
            >
              {sourceNodeId ? "Create Connected Task" : "Create Task"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
