import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  Button,
  Input,
  Calendar,
} from "@/components/ui";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Calendar as CalendarIcon,
  X,
  User,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { useFlowStore } from "../store/useFlowStore";
import { TaskPriority, TaskStatus } from "@prisma/client";
import { format as dateFnsFormat } from "date-fns";
import { getPriorityIcon, getPriorityStyles } from "@/utils/priority";
import { getStatusIcon, getStatusColor } from "@/utils/status";
import { cn } from "@/lib/utils";
import { TaskType } from "../types/flow.types";
import { v4 as uuidv4 } from "uuid";
import { EDGE_TYPES } from "../edges/EdgeTypes";
import { Edge } from "reactflow";
import {
  createNodeInBackground,
  createNodeWithEdgesInBackground,
} from "../bi/tasks";
import { getNextCardPosition } from "./nextCardposition";

interface PrioritySelectProps {
  value: TaskPriority | null;
  onChange: (value: TaskPriority) => void;
}

function PrioritySelect({ value, onChange }: PrioritySelectProps) {
  const PriorityIcon = value ? getPriorityIcon(value) : null;

  return (
    <Select
      value={value || ""}
      onValueChange={(value) => onChange(value as TaskPriority)}
    >
      <SelectTrigger
        className={cn(
          "h-9 px-2.5 flex-1 min-w-[160px] transition-colors",
          value
            ? getPriorityStyles(value)
            : "bg-accent/20 text-muted-foreground hover:bg-accent/30"
        )}
      >
        <div className="flex items-center gap-1.5">
          {PriorityIcon && <PriorityIcon className="w-4 h-4" />}
          <span className="text-sm font-medium">{value || "Priority"}</span>
        </div>
      </SelectTrigger>
      <SelectContent align="start" className="p-1 flex">
        {Object.values(TaskPriority).map((option) => {
          const Icon = getPriorityIcon(option);
          return (
            <SelectItem
              key={option}
              value={option}
              className={cn(
                "flex items-center gap-1.5 py-1.5 pl-2 pr-2 cursor-pointer rounded-md transition-colors",
                getPriorityStyles(option),
                "hover:opacity-90",
                "focus:ring-1 focus:ring-primary/30",
                "data-[state=checked]:opacity-100"
              )}
            >
              <div className="flex items-center gap-1.5">
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{option}</span>
              </div>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}

interface StatusSelectProps {
  value: TaskStatus | null;
  onChange: (value: TaskStatus) => void;
}

function StatusSelect({ value, onChange }: StatusSelectProps) {
  const StatusIcon = value ? getStatusIcon(value) : null;

  return (
    <Select
      value={value || ""}
      onValueChange={(value) => onChange(value as TaskStatus)}
    >
      <SelectTrigger
        className={cn(
          "h-9 px-2.5 flex-1 min-w-[160px] transition-colors",
          value && [
            `bg-${getStatusColor(value)}/10`,
            `text-${getStatusColor(value)}`,
            "border-none",
            "hover:opacity-90",
          ],
          !value && [
            "bg-accent/20",
            "text-muted-foreground",
            "hover:bg-accent/30",
          ]
        )}
      >
        <div className="flex items-center gap-1.5">
          {StatusIcon && <StatusIcon className="w-4 h-4" />}
          <span className="text-sm font-medium">{value || "Status"}</span>
        </div>
      </SelectTrigger>
      <SelectContent align="start" className="p-1 flex">
        {Object.values(TaskStatus).map((option) => {
          const Icon = getStatusIcon(option);
          const statusColor = getStatusColor(option);
          return (
            <SelectItem
              key={option}
              value={option}
              className={cn(
                "flex items-center gap-1.5 py-1.5 pl-2 pr-2 cursor-pointer rounded-md transition-colors",
                `text-${statusColor}`,
                `bg-${statusColor}/10`,
                "hover:opacity-90",
                "focus:ring-1 focus:ring-primary/30",
                "data-[state=checked]:opacity-100"
              )}
            >
              <div className="flex items-center gap-1.5">
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{option}</span>
              </div>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}

interface DatePickerProps {
  startDate: Date | null;
  endDate: Date | null;
  onStartDateChange: (date: Date | null) => void;
  onEndDateChange: (date: Date | null) => void;
}

function DatePicker({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}: DatePickerProps) {
  return (
    <div className="flex items-center gap-1.5 flex-1">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            className="h-9 px-2.5 rounded-md bg-accent/30 border-none text-sm font-medium flex items-center gap-1.5 flex-1"
          >
            <CalendarIcon className="w-4 h-4" />
            {startDate ? dateFnsFormat(startDate, "MMM d") : "Start date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={startDate || undefined}
            onSelect={(date) => onStartDateChange(date || null)}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            className="h-9 px-2.5 rounded-md bg-accent/30 border-none text-sm font-medium flex items-center gap-1.5 flex-1"
          >
            <CalendarIcon className="w-4 h-4" />
            {endDate ? dateFnsFormat(endDate, "MMM d") : "Due date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={endDate || undefined}
            onSelect={(date) => onEndDateChange(date || null)}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

interface AssigneeInputProps {
  assignees: string[];
  onAssigneeAdd: (assignee: string) => void;
  onAssigneeRemove: (assignee: string) => void;
  isInputActive: boolean;
  onInputActiveChange: (active: boolean) => void;
}

function AssigneeInput({
  assignees,
  onAssigneeAdd,
  onAssigneeRemove,
  isInputActive,
  onInputActiveChange,
}: AssigneeInputProps) {
  const [newAssignee, setNewAssignee] = useState("");

  const handleAddAssignee = () => {
    if (newAssignee && !assignees.includes(newAssignee)) {
      onAssigneeAdd(newAssignee);
      setNewAssignee("");
    }
    onInputActiveChange(false);
  };
  return (
    <>
      <Button
        variant="ghost"
        onClick={() => onInputActiveChange(!isInputActive)}
        className="h-9 px-2.5 rounded-md bg-accent/30 border-none text-sm font-medium flex items-center gap-1.5 min-w-[120px]"
      >
        <User className="w-4 h-4" />
        {assignees.length > 0 ? `${assignees.length} assigned` : "Add assignee"}
      </Button>

      {isInputActive && (
        <div className="relative">
          <Input
            type="text"
            value={newAssignee}
            onChange={(e) => setNewAssignee(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && newAssignee) {
                handleAddAssignee();
              }
            }}
            placeholder="Enter name and press Enter"
            className="h-9 px-2.5 text-sm"
            autoFocus
          />
        </div>
      )}

      {assignees.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {assignees.map((assignee) => (
            <span
              key={assignee}
              className="inline-flex items-center gap-1 px-2 py-1 bg-accent/50 rounded-md text-sm"
            >
              <User className="w-3.5 h-3.5" />
              {assignee}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onAssigneeRemove(assignee)}
                className="hover:text-primary ml-0.5 h-4 w-4"
              >
                <X className="w-3.5 h-3.5" />
              </Button>
            </span>
          ))}
        </div>
      )}
    </>
  );
}

interface ConnectionTypeSelectProps {
  value: string | null;
  onChange: (value: string) => void;
}

function ConnectionTypeSelect({ value, onChange }: ConnectionTypeSelectProps) {
  return (
    <Select value={value || ""} onValueChange={onChange}>
      <SelectTrigger
        className={cn(
          "h-9 px-2.5 flex-1 min-w-[160px] transition-colors",
          value
            ? "bg-primary/10 text-primary border-primary/20"
            : "bg-accent/20 text-muted-foreground hover:bg-accent/30"
        )}
      >
        <div className="flex items-center gap-1.5">
          {value === EDGE_TYPES.NEXT_TASK && <ArrowRight className="w-4 h-4" />}
          {value === EDGE_TYPES.OPTIONAL_NEXT && (
            <ArrowRight className="w-4 h-4 opacity-50" />
          )}
          {value === EDGE_TYPES.BLOCKED && (
            <AlertCircle className="w-4 h-4 text-destructive" />
          )}
          <span className="text-sm font-medium">
            {value === EDGE_TYPES.NEXT_TASK && "Next Task"}
            {value === EDGE_TYPES.OPTIONAL_NEXT && "Optional Next"}
            {value === EDGE_TYPES.BLOCKED && "Blocked Task"}
            {!value && "Connection Type"}
          </span>
        </div>
      </SelectTrigger>
      <SelectContent align="start" className="p-1 flex">
        <SelectItem
          value={EDGE_TYPES.NEXT_TASK}
          className="flex items-center gap-1.5 py-1.5 pl-2 pr-2 cursor-pointer rounded-md transition-colors hover:bg-primary/10"
        >
          <ArrowRight className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">Next Task</span>
        </SelectItem>
        <SelectItem
          value={EDGE_TYPES.OPTIONAL_NEXT}
          className="flex items-center gap-1.5 py-1.5 pl-2 pr-2 cursor-pointer rounded-md transition-colors hover:bg-primary/10"
        >
          <ArrowRight className="w-4 h-4 text-primary opacity-50" />
          <span className="text-sm font-medium">Optional Next</span>
        </SelectItem>
        <SelectItem
          value={EDGE_TYPES.BLOCKED}
          className="flex items-center gap-1.5 py-1.5 pl-2 pr-2 cursor-pointer rounded-md transition-colors hover:bg-destructive/10"
        >
          <AlertCircle className="w-4 h-4 text-destructive" />
          <span className="text-sm font-medium">Blocked Task</span>
        </SelectItem>
      </SelectContent>
    </Select>
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
  const { addNode, taskFlowId, setEdges, edges } = useFlowStore();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TaskPriority | null>(null);
  const [status, setStatus] = useState<TaskStatus | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [assignees, setAssignees] = useState<string[]>([]);
  const [isAssigneeInputActive, setIsAssigneeInputActive] = useState(false);
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
    const newNode: TaskType = {
      id: `task-${uuidv4()}`,
      title,
      description,
      priority: priority || null,
      status: status || TaskStatus.TODO,
      startDate: startDate || null,
      dueDate: endDate || null,
      assigneesIds: assignees.length > 0 ? assignees : [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Add the node and get its ID
    addNode(newNodeId, newNode);
    if (!sourceNodeId) {
      createNodeInBackground({
        id: newNodeId,
        taskFlowId: taskFlowId,
        node: {
          id: newNodeId,
          type: "card",
          position: { x: 0, y: 0 },
          data: newNode,
        },
      });
    }
    // If there's a source node and connection type is selected, create the connection
    if (sourceNodeId && connectionType && newNode.id) {
      const nextCardPosition = getNextCardPosition(sourceNodeId);
      // Create a connection object that matches ReactFlow's Edge type
      const newEdge: Edge = {
        id: `edge-${uuidv4()}`,
        source: sourceNodeId,
        target: newNodeId,
        sourceHandle: null,
        targetHandle: null,
        type: connectionType,
        style: {
          stroke: "#000",
          strokeWidth: 2,
          strokeLinecap: "round",
          strokeLinejoin: "round",
        },
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
    setStartDate(null);
    setEndDate(null);
    setAssignees([]);
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
        <DialogHeader className="px-4 pt-4 pb-2 border-b border-border/50">
          <DialogTitle className="text-base font-semibold">
            {sourceNodeId ? "Create Connected Task" : "Create Task"}
          </DialogTitle>
        </DialogHeader>

        <div className="px-4 py-3 space-y-3">
          {/* Priority and Status Row */}
          <div className="flex items-center gap-2">
            <PrioritySelect value={priority} onChange={setPriority} />
            <StatusSelect value={status} onChange={setStatus} />
          </div>

          {/* Title Input */}
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task title"
            className="h-10 text-base font-medium"
            autoFocus
          />

          {/* Connection Type (only shown when creating from a source node) */}
          {sourceNodeId && (
            <div className="flex items-center gap-2">
              <ConnectionTypeSelect
                value={connectionType}
                onChange={setConnectionType}
              />
            </div>
          )}

          {/* Dates and Assignee Row */}
          <div className="flex items-center gap-2">
            <DatePicker
              startDate={startDate}
              endDate={endDate}
              onStartDateChange={setStartDate}
              onEndDateChange={setEndDate}
            />
            <AssigneeInput
              assignees={assignees}
              onAssigneeAdd={(assignee) =>
                setAssignees([...assignees, assignee])
              }
              onAssigneeRemove={(assignee) =>
                setAssignees(assignees.filter((a) => a !== assignee))
              }
              isInputActive={isAssigneeInputActive}
              onInputActiveChange={setIsAssigneeInputActive}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-3 border-t border-border/50">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                resetForm();
                onClose();
              }}
              className="px-3 text-sm font-medium"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateTask}
              disabled={Boolean(!title || (sourceNodeId && !connectionType))}
              size="sm"
              className="px-3 py-1.5 text-sm font-medium"
            >
              {sourceNodeId ? "Create Connected Task" : "Create Task"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
