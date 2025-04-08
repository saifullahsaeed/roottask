import { useState } from "react";
import { DropResult } from "@hello-pangea/dnd";
import type { Task } from "@prisma/client";
import { useProjectStore } from "@/stores/useProjectStore";
import { useUpdateTaskPositions } from "./useTasks";
import { useUpdateTask } from "./useTasks";

export interface Column {
  id: string;
  title: string;
  tasks: Task[];
}

/**
 * Custom hook to manage board state and drag-drop functionality
 * @param projectId The ID of the project
 * @returns Board state and handlers
 */
export function useBoard(projectId: string) {
  const [columns, setColumns] = useState<Column[]>([]);
  const { tasks, setTasks } = useProjectStore();
  const updateTaskPositions = useUpdateTaskPositions(projectId);
  const updateTask = useUpdateTask(projectId);

  /**
   * Handles the end of a drag operation
   * @param result The result of the drag operation
   */
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination || !tasks) return;

    const { source, destination } = result;
    const sourceStatusId = source.droppableId;
    const destinationStatusId = destination.droppableId;

    // Get the task being moved
    const sourceStatusTasks = tasks.filter(
      (task) => task.statusId === sourceStatusId
    );
    const movedTask = sourceStatusTasks[source.index];

    if (!movedTask) return;

    // If task is dropped in the same status
    if (sourceStatusId === destinationStatusId) {
      const statusTasks = tasks.filter(
        (task) => task.statusId === sourceStatusId
      );

      // Create new array of tasks
      const reorderedTasks = Array.from(statusTasks);
      const [removed] = reorderedTasks.splice(source.index, 1);
      reorderedTasks.splice(destination.index, 0, removed);

      // Update positions locally
      const updatedTasks = tasks.map((task) => {
        if (task.statusId === sourceStatusId) {
          const newPosition = reorderedTasks.findIndex((t) => t.id === task.id);
          return { ...task, position: newPosition };
        }
        return task;
      });

      // Update store
      setTasks(updatedTasks);

      // Update positions in database
      updateTaskPositions.mutate({
        statusId: sourceStatusId,
        taskIds: reorderedTasks.map((task) => task.id),
      });
    }
    // If task is moved to a different status
    else {
      // Get tasks in destination status
      const destinationTasks = tasks.filter(
        (task) => task.statusId === destinationStatusId
      );

      // Insert task at the correct position
      const newDestinationTasks = Array.from(destinationTasks);
      newDestinationTasks.splice(destination.index, 0, {
        ...movedTask,
        statusId: destinationStatusId,
      });

      // Remove task from source status
      const newSourceTasks = sourceStatusTasks.filter(
        (task) => task.id !== movedTask.id
      );

      // Update all tasks with new positions
      const updatedTasks = tasks.map((task) => {
        // If task is the one being moved
        if (task.id === movedTask.id) {
          return {
            ...task,
            statusId: destinationStatusId,
            position: destination.index,
          };
        }
        // If task is in destination status and after insert position
        else if (task.statusId === destinationStatusId) {
          const newPosition = newDestinationTasks.findIndex(
            (t) => t.id === task.id
          );
          return { ...task, position: newPosition };
        }
        // If task is in source status
        else if (task.statusId === sourceStatusId) {
          const newPosition = newSourceTasks.findIndex((t) => t.id === task.id);
          return newPosition !== -1 ? { ...task, position: newPosition } : task;
        }
        return task;
      });

      // Update store
      setTasks(updatedTasks);

      // Update task status and position in database
      updateTask.mutate({
        taskId: movedTask.id,
        statusId: destinationStatusId,
        projectId,
        data: {
          statusId: destinationStatusId,
          position: destination.index,
        },
      });

      // Update positions for both source and destination status
      if (newSourceTasks.length > 0) {
        updateTaskPositions.mutate({
          statusId: sourceStatusId,
          taskIds: newSourceTasks.map((task) => task.id),
        });
      }

      updateTaskPositions.mutate({
        statusId: destinationStatusId,
        taskIds: newDestinationTasks.map((task) => task.id),
      });
    }
  };

  /**
   * Adds a new task to a specific column
   * @param columnId The ID of the column to add the task to
   * @param task The task to add
   */
  const addTaskToColumn = (columnId: string, task: Task) => {
    setColumns(
      columns.map((col) => {
        if (col.id === columnId) {
          return { ...col, tasks: [...col.tasks, task] };
        }
        return col;
      })
    );
  };

  /**
   * Removes a task from a column
   * @param columnId The ID of the column containing the task
   * @param taskId The ID of the task to remove
   */
  const removeTaskFromColumn = (columnId: string, taskId: string) => {
    setColumns(
      columns.map((col) => {
        if (col.id === columnId) {
          return {
            ...col,
            tasks: col.tasks.filter((task) => task.id !== taskId),
          };
        }
        return col;
      })
    );
  };

  return {
    columns,
    handleDragEnd,
    addTaskToColumn,
    removeTaskFromColumn,
  };
}
