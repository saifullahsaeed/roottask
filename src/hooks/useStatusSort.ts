import { useMutation } from "@tanstack/react-query";

interface SortStatusesInput {
  statusIds: string[];
}

/**
 * Hook for sorting statuses in a project
 * @param projectId The ID of the project
 * @returns A mutation object for sorting statuses
 */
export function useStatusSort(projectId?: string) {
  const { mutate, isPending } = useMutation({
    mutationFn: async (data: SortStatusesInput) => {
      if (!projectId) {
        throw new Error("Project ID is required");
      }

      // Send the request to the backend
      const response = await fetch(`/api/projects/${projectId}/statuses/sort`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to sort statuses");
      }

      // We don't need to return anything as we've already updated the UI
      return null;
    },
  });

  return {
    sortStatuses: mutate,
    isSorting: isPending,
  };
}
