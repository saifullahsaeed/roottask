import { Position, NodeProps } from "reactflow";
import { ChevronLeft, Trash2 } from "lucide-react";
import { TaskType } from "../types/flow.types";
import { useFlowStore } from "../store/useFlowStore";
import { cn } from "@/lib/utils";
import { StatusBadge } from "./card/StatusBadge";
import { PriorityBadge } from "./card/PriorityBadge";
import { DueDate } from "./card/DueDate";
import { Assignees } from "./card/Assignees";
import { CustomHandle } from "./CustomHandle";
import { TaskStatus } from "@prisma/client";
import { Button } from "@/components/ui/button/Button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

export function CardNode({ data, selected, id }: NodeProps<TaskType>) {
  const updateNode = useFlowStore((state) => state.updateNode);
  const { toggleTaskDetails, deleteNode } = useFlowStore();

  const handleStatusChange = (newStatus: TaskStatus) => {
    updateNode(id, { ...data, status: newStatus });
  };

  const handleShowDetails = () => {
    toggleTaskDetails(id);
  };

  const handleDelete = async () => {
    try {
      await deleteNode(id);
      toast.success("Task deleted successfully");
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Failed to delete task. Please try again.");
    }
  };

  return (
    <div
      className={cn(
        "group w-[300px] rounded-xl border-2 transition-all duration-200",
        selected
          ? "border-primary/80 shadow-xl ring-2 ring-primary/20 bg-primary/5"
          : "border-border/40 shadow-md hover:shadow-lg",
        data.status === "TODO" &&
          "border-dashed border-gray-500/50 bg-gray-500/10",
        data.status === "IN_PROGRESS" && "border-indigo-500 bg-indigo-500",
        data.status === "COMPLETED" && "border-green-500 bg-green-500",
        "hover:shadow-xl bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      )}
    >
      <CustomHandle
        handleType="target"
        position={Position.Left}
        isConnectable
        nodeId={id}
      />

      <div className="p-3 space-y-2">
        {/* Status and Priority Row */}
        <div className="flex items-center justify-between gap-2">
          {data.status && (
            <StatusBadge
              status={data.status}
              onStatusChange={handleStatusChange}
            />
          )}
          <div className="flex items-center gap-2">
            {data.priority && <PriorityBadge priority={data.priority} />}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Task</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this task? This action
                    cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        {/* Title */}
        <div className="space-y-0.5">
          <h3 className="font-medium text-foreground/90 line-clamp-2 text-sm leading-relaxed">
            {data.title}
          </h3>
        </div>

        {/* Due Date, Assignees and Details Button */}
        <div className="flex items-center justify-between pt-1 border-t border-border/40">
          <button
            className="p-1 rounded-md hover:bg-muted/50 transition-colors"
            onClick={handleShowDetails}
          >
            <ChevronLeft className="w-4 h-4 text-muted-foreground" />
          </button>
          <div className="flex items-center gap-2">
            {data.dueDate && <DueDate dueDate={data.dueDate?.toString()} />}
            {data.assignees && Array.isArray(data.assignees) ? (
              <Assignees assignees={data.assignees} />
            ) : (
              data.assignees && <Assignees assignees={[data.assignees]} />
            )}
          </div>
        </div>
      </div>

      <CustomHandle
        handleType="source"
        position={Position.Right}
        isConnectable
        nodeId={id}
      />
    </div>
  );
}
