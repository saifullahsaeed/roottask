import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useFlowStore } from "../store/useFlowStore";
import { NodeChange } from "reactflow";
import { TaskType } from "../types/flow.types";
import { updateNodeInBackground } from "../bi/tasks";
import { TaskNode, Task } from "@prisma/client";

interface NodeFromAPI extends TaskNode {
  task: Task;
}

export function useNodesHook(taskFlowId: string) {
  const queryClient = useQueryClient();
  const { nodes, setNodes, onNodesChange, updateNode, addNode } =
    useFlowStore();

  // Fetch nodes
  const { isLoading } = useQuery({
    queryKey: ["nodes", taskFlowId],
    queryFn: async () => {
      const response = await fetch(`/api/taskflows/${taskFlowId}/nodes`);
      if (!response.ok) throw new Error("Failed to fetch nodes");
      const data = (await response.json()) as NodeFromAPI[];

      // Ensure each node has position data
      const nodesWithPosition = data.map((node) => ({
        ...node,
        data: node.task as TaskType,
        position: {
          x: node.positionX || 0,
          y: node.positionY || 0,
        },
      }));

      setNodes(nodesWithPosition);
      return nodesWithPosition;
    },
  });

  // Create node mutation
  const createNodeMutation = useMutation({
    mutationFn: async (nodeData: {
      type: string;
      positionX: number;
      positionY: number;
      data: TaskType;
    }) => {
      const response = await fetch(`/api/taskflows/${taskFlowId}/nodes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(nodeData),
      });
      if (!response.ok) throw new Error("Failed to create node");
      return response.json();
    },
    onSuccess: (newNode) => {
      queryClient.invalidateQueries({ queryKey: ["nodes", taskFlowId] });
      addNode(newNode.data);
    },
  });

  // Update node mutation
  const updateNodeMutation = useMutation({
    mutationFn: async (nodeData: {
      id: string;
      type: string;
      positionX: number;
      positionY: number;
      data: TaskType;
    }) => {
      const response = await fetch(`/api/taskflows/${taskFlowId}/nodes`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(nodeData),
      });
      if (!response.ok) throw new Error("Failed to update node");
      return response.json();
    },
    onSuccess: (updatedNode) => {
      queryClient.invalidateQueries({ queryKey: ["nodes", taskFlowId] });
      updateNode(updatedNode.id, updatedNode.data);
    },
  });

  // Delete node mutation
  const deleteNodeMutation = useMutation({
    mutationFn: async (nodeId: string) => {
      const response = await fetch(
        `/api/taskflows/${taskFlowId}/nodes?nodeId=${nodeId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) throw new Error("Failed to delete node");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nodes", taskFlowId] });
    },
  });

  // Handle node changes
  const handleNodesChange = (changes: NodeChange[]) => {
    // First update the local Zustand store
    onNodesChange(changes);

    // Then handle position updates in the background
    changes.forEach((change) => {
      if (change.type === "position" && change.dragging) {
        const node = nodes.find((n) => n.id === change.id);
        if (node && node.type) {
          // Update the node in the background
          updateNodeInBackground({
            taskFlowId,
            nodeId: node.id,
            updates: {
              positionX: change.position?.x || node.position.x,
              positionY: change.position?.y || node.position.y,
            },
          });
        }
      }
    });
  };

  return {
    nodes,
    isLoading,
    handleNodesChange,
    createNode: createNodeMutation.mutate,
    updateNode: updateNodeMutation.mutate,
    deleteNode: deleteNodeMutation.mutate,
  };
}
