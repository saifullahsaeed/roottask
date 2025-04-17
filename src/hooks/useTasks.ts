import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Task } from "@prisma/client";
import { useProjectStore } from "@/stores/useProjectStore";

interface CreateTaskInput {
  title: string;
  statusId: string;
  description?: string | null;
  priority?: string | null;
  startDate?: string | null;
  dueDate?: string | null;
}

interface UpdateTaskPositionsInput {
  taskIds: string[];
  statusId: string;
}

async function fetchTasks(projectId: string, filters?: { statusId?: string }) {
  const response = await fetch(
    `/api/projects/${projectId}/tasks${
      filters?.statusId ? `?statusId=${filters.statusId}` : ""
    }`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch tasks");
  }
  return await response.json();
}

export function useTasks(
  projectId: string | null,
  filters?: { statusId?: string }
) {
  const { setTasks } = useProjectStore();

  return useQuery<Task[], Error>({
    queryKey: ["tasks", projectId, filters],
    queryFn: async () => {
      if (!projectId) {
        setTasks([]);

        return [];
      }
      const tasks = await fetchTasks(projectId, filters);
      // Sort tasks by position before setting in store
      const sortedTasks = tasks.sort(
        (a: Task, b: Task) => a.position - b.position
      );
      setTasks(sortedTasks);
      return sortedTasks;
    },
  });
}

async function createTask(projectId: string, data: CreateTaskInput) {
  const response = await fetch(
    `/api/projects/${projectId}/statuses/${data.statusId}/task`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...data,
        position: 0, // Always create at position 0 (top of the list)
      }),
    }
  );
  if (!response.ok) {
    throw new Error("Failed to create task");
  }
  return response.json();
}

export function useCreateTask(projectId: string) {
  const queryClient = useQueryClient();
  const { addTask, tasks, updateTask } = useProjectStore();

  return useMutation({
    mutationFn: (data: CreateTaskInput) => createTask(projectId, data),
    onSuccess: (newTask) => {
      // Shift positions of existing tasks in the same status
      const statusTasks =
        tasks?.filter((task) => task.statusId === newTask.statusId) || [];
      statusTasks.forEach((task) => {
        updateTask(task.id, { ...task, position: task.position + 1 });
      });

      // Add the new task at position 0
      addTask(newTask);

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}

async function updateTaskPositions(
  projectId: string,
  statusId: string,
  taskIds: string[]
) {
  const response = await fetch(
    `/api/projects/${projectId}/statuses/${statusId}/tasks/sort`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ taskIds }),
    }
  );
  if (!response.ok) {
    throw new Error("Failed to update task positions");
  }
  return response.json();
}

export function useUpdateTaskPositions(projectId: string) {
  const queryClient = useQueryClient();
  const { tasks, setTasks } = useProjectStore();

  return useMutation({
    mutationFn: ({ taskIds, statusId }: UpdateTaskPositionsInput) =>
      updateTaskPositions(projectId, statusId, taskIds),
    onMutate: async ({ taskIds, statusId }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["tasks"] });

      // Snapshot the previous value
      const previousTasks = tasks;

      // Optimistically update tasks positions
      const updatedTasks = [...(tasks || [])].map((task) => {
        if (task.statusId === statusId) {
          const newPosition = taskIds.indexOf(task.id);
          return newPosition !== -1 ? { ...task, position: newPosition } : task;
        }
        return task;
      });

      setTasks(updatedTasks);

      return { previousTasks };
    },
    onError: (err, newTasks, context) => {
      // Rollback on error
      if (context?.previousTasks) {
        setTasks(context.previousTasks);
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}

interface UpdateTaskInput {
  taskId: string;
  statusId: string;
  projectId: string;
  data: {
    title?: string;
    description?: string | null;
    priority?: string | null;
    startDate?: string | null;
    dueDate?: string | null;
    position?: number;
    statusId?: string;
  };
}

async function updateTask(
  projectId: string,
  statusId: string,
  taskId: string,
  data: UpdateTaskInput["data"]
) {
  const response = await fetch(
    `/api/projects/${projectId}/statuses/${statusId}/task/${taskId}`,
    {
      method: "PUT",
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
}

export function useUpdateTask(projectId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateTaskInput) =>
      updateTask(projectId, data.statusId, data.taskId, data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}
