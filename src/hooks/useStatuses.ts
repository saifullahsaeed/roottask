import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { TaskStatus } from "@prisma/client";
import { useProjectStore } from "@/stores/useProjectStore";

// Define the type for creating a new status
interface CreateStatusInput {
  name: string;
  description?: string;
  position?: number;
}

// Define the type for creating multiple statuses
interface CreateStatusesInput {
  statuses: CreateStatusInput[];
}

// Define the type for updating a status
interface UpdateStatusInput {
  name?: string;
  description?: string;
  position?: number;
}

async function fetchStatuses(projectId: string): Promise<TaskStatus[]> {
  const response = await fetch(`/api/projects/${projectId}/statuses`);
  if (!response.ok) {
    throw new Error("Failed to fetch statuses");
  }
  return await response.json();
}

export function useStatuses(projectId: string | undefined) {
  const { setIsLoading, setStatuses } = useProjectStore();
  return useQuery<TaskStatus[], Error>({
    queryKey: ["statuses", projectId],
    queryFn: async () => {
      const statuses = await fetchStatuses(projectId!);
      setStatuses(statuses);
      setIsLoading(false);
      return statuses;
    },
    enabled: !!projectId,
  });
}

async function createStatuses(
  data: CreateStatusesInput,
  projectId: string
): Promise<TaskStatus[]> {
  const response = await fetch(`/api/projects/${projectId}/statuses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to create statuses");
  }

  return await response.json();
}

async function createStatus(
  data: CreateStatusInput,
  projectId: string
): Promise<TaskStatus> {
  // Create a single status by wrapping it in the expected format
  const response = await createStatuses({ statuses: [data] }, projectId);
  return response[0]; // Return the first (and only) created status
}

async function updateStatus(
  projectId: string,
  statusId: string,
  data: UpdateStatusInput
): Promise<TaskStatus> {
  const response = await fetch(
    `/api/projects/${projectId}/statuses/${statusId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to update status");
  }

  return await response.json();
}

export function useCreateStatuses(projectId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation<TaskStatus[], Error, CreateStatusesInput>({
    mutationFn: (data: CreateStatusesInput) => createStatuses(data, projectId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["statuses", projectId] });
    },
  });
}

export function useCreateStatus(projectId: string | undefined) {
  const queryClient = useQueryClient();
  const { addStatus } = useProjectStore();
  return useMutation<TaskStatus, Error, CreateStatusInput>({
    mutationFn: (data: CreateStatusInput) => createStatus(data, projectId!),
    onSuccess: (status) => {
      queryClient.invalidateQueries({ queryKey: ["statuses", projectId] });
      addStatus(status);
    },
  });
}

export function useUpdateStatus(projectId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation<
    TaskStatus,
    Error,
    { statusId: string; data: UpdateStatusInput }
  >({
    mutationFn: ({
      statusId,
      data,
    }: {
      statusId: string;
      data: UpdateStatusInput;
    }) => updateStatus(projectId!, statusId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["statuses", projectId] });
    },
  });
}

async function deleteStatus(
  projectId: string,
  statusId: string,
  moveTasksTo?: string
): Promise<void> {
  const response = await fetch(
    `/api/projects/${projectId}/statuses/${statusId}?moveTasksTo=${moveTasksTo}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to delete status");
  }
}

export function useDeleteStatus(projectId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation<void, Error, { statusId: string; moveTasksTo?: string }>({
    mutationFn: ({ statusId, moveTasksTo }) =>
      deleteStatus(projectId!, statusId, moveTasksTo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["statuses", projectId] });
    },
  });
}
