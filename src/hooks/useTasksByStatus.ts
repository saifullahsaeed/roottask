import { useQuery } from "@tanstack/react-query";
import type { Task } from "@prisma/client";

async function fetchTasksByStatus(
  projectId: string,
  statusId: string
): Promise<Task[]> {
  const response = await fetch(
    `/api/projects/${projectId}/statuses/${statusId}/tasks`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch tasks");
  }
  return response.json();
}

export function useTasksByStatus(
  projectId: string | undefined,
  statusId: string | undefined
) {
  return useQuery({
    queryKey: ["tasks", projectId, statusId],
    queryFn: () => {
      if (!projectId || !statusId) {
        return Promise.resolve([]);
      }
      return fetchTasksByStatus(projectId, statusId);
    },
    enabled: !!projectId && !!statusId,
  });
}
