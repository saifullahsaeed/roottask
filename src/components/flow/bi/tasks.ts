import { TaskType } from "../types/flow.types";
import { Node, Edge } from "reactflow";
import { createBulkEdgesInBackground } from "./edges";

interface CreateNodeTaskData {
  id: string;
  taskFlowId: string;
  node: Node<TaskType>;
}

interface CreateNodeWithEdgesTaskData {
  taskFlowId: string;
  node: Node<TaskType>;
  edges: {
    source: string;
    target: string;
    type?: string;
    data?: Edge;
    id: string;
  }[];
}

interface UpdateNodeTaskData {
  taskFlowId: string;
  nodeId: string;
  updates: {
    type?: string;
    positionX?: number;
    positionY?: number;
    data?: Partial<TaskType>;
  };
}

interface UpdateTaskData {
  taskFlowId: string;
  taskId: string;
  updates: Partial<TaskType>;
}

export async function createNodeInBackground(
  data: CreateNodeTaskData
): Promise<void> {
  // Create a new Promise that resolves immediately
  Promise.resolve().then(async () => {
    try {
      if (!data.taskFlowId) {
        throw new Error("Task flow ID is required");
      }

      const response = await fetch(`/api/taskflows/${data.taskFlowId}/nodes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: data.node.id,
          type: data.node.type,
          positionX: data.node.position.x,
          positionY: data.node.position.y,
          data: data.node.data,
        }),
      });

      if (!response.ok) {
        console.error(
          "Failed to create node in background:",
          await response.text()
        );
      }
    } catch (error) {
      console.error("Error creating node in background:", error);
    }
  });

  // Return immediately without waiting for the background task
  return;
}

export async function updateNodeInBackground(
  data: UpdateNodeTaskData
): Promise<void> {
  // Create a new Promise that resolves immediately
  Promise.resolve().then(async () => {
    try {
      if (!data.taskFlowId || !data.nodeId) {
        throw new Error("Task flow ID and node ID are required");
      }

      const response = await fetch(`/api/taskflows/${data.taskFlowId}/nodes`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: data.nodeId,
          ...data.updates,
        }),
      });

      if (!response.ok) {
        console.error(
          "Failed to update node in background:",
          await response.text()
        );
      }
    } catch (error) {
      console.error("Error updating node in background:", error);
    }
  });

  // Return immediately without waiting for the background task
  return;
}

export async function updateTaskInBackground(
  data: UpdateTaskData
): Promise<void> {
  Promise.resolve().then(async () => {
    try {
      if (!data.taskFlowId || !data.taskId) {
        throw new Error("Task flow ID and task ID are required");
      }

      const response = await fetch(
        `/api/taskflows/${data.taskFlowId}/nodes/tasks/${data.taskId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data.updates),
        }
      );

      if (!response.ok) {
        console.error(
          "Failed to update task in background:",
          await response.text()
        );
      }
    } catch (error) {
      console.error("Error updating task in background:", error);
    }
  });

  return;
}

interface DeleteNodeTaskData {
  taskFlowId: string;
  nodeId: string;
}

export async function deleteNodeInBackground(
  data: DeleteNodeTaskData
): Promise<void> {
  Promise.resolve().then(async () => {
    try {
      if (!data.taskFlowId || !data.nodeId) {
        throw new Error("Task flow ID and node ID are required");
      }

      const response = await fetch(
        `/api/taskflows/${data.taskFlowId}/nodes?nodeId=${data.nodeId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        console.error(
          "Failed to delete node in background:",
          await response.text()
        );
      }
    } catch (error) {
      console.error("Error deleting node in background:", error);
    }
  });

  return;
}

export async function createNodeWithEdgesInBackground(
  data: CreateNodeWithEdgesTaskData
): Promise<void> {
  Promise.resolve().then(async () => {
    try {
      if (!data.taskFlowId) {
        throw new Error("Task flow ID is required");
      }

      // Create the node first
      const nodeResponse = await fetch(
        `/api/taskflows/${data.taskFlowId}/nodes`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: data.node.id,
            type: data.node.type,
            positionX: data.node.position.x,
            positionY: data.node.position.y,
            data: data.node.data,
          }),
        }
      );

      if (!nodeResponse.ok) {
        throw new Error(`Failed to create node: ${await nodeResponse.text()}`);
      }

      // Wait for node to be created before creating edges
      await new Promise((resolve) => setTimeout(resolve, 100));

      // If there are edges to create, create them in bulk
      if (data.edges && data.edges.length > 0) {
        await createBulkEdgesInBackground({
          taskFlowId: data.taskFlowId,
          edges: data.edges,
        });
      }
    } catch (error) {
      console.error("Error creating node with edges in background:", error);
    }
  });

  return;
}
