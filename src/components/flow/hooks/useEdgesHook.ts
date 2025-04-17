import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useFlowStore } from "../store/useFlowStore";
import { Edge, EdgeChange } from "reactflow";

interface EdgeData {
  source: string;
  target: string;
  type?: string;
  data?: Edge;
}

export function useEdgesHook(taskFlowId: string) {
  const queryClient = useQueryClient();
  const { edges, setEdges, onEdgesChange } = useFlowStore();

  // Fetch edges
  const { isLoading } = useQuery({
    queryKey: ["edges", taskFlowId],
    queryFn: async () => {
      const response = await fetch(`/api/taskflows/${taskFlowId}/edges`);
      if (!response.ok) throw new Error("Failed to fetch edges");
      const data = await response.json();
      setEdges(data);
      return data;
    },
  });

  // Create edge mutation
  const createEdgeMutation = useMutation({
    mutationFn: async (edgeData: EdgeData) => {
      const response = await fetch(`/api/taskflows/${taskFlowId}/edges`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(edgeData),
      });
      if (!response.ok) throw new Error("Failed to create edge");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["edges", taskFlowId] });
    },
  });

  // Delete edge mutation
  const deleteEdgeMutation = useMutation({
    mutationFn: async (edgeId: string) => {
      const response = await fetch(
        `/api/taskflows/${taskFlowId}/edges?edgeId=${edgeId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) throw new Error("Failed to delete edge");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["edges", taskFlowId] });
    },
  });

  // Handle edge changes
  const handleEdgesChange = (changes: EdgeChange[]) => {
    onEdgesChange(changes);

    // Handle edge deletions
    changes.forEach((change) => {
      if (change.type === "remove") {
        deleteEdgeMutation.mutate(change.id);
      }
    });
  };

  return {
    edges,
    isLoading,
    handleEdgesChange,
    createEdge: createEdgeMutation.mutate,
    deleteEdge: deleteEdgeMutation.mutate,
  };
}
