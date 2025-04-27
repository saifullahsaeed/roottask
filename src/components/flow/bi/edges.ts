import { Edge } from "reactflow";

interface CreateEdgeTaskData {
  taskFlowId: string;
  source: string;
  target: string;
  type?: string;
  data?: Edge;
  id: string;
}

interface CreateBulkEdgesTaskData {
  taskFlowId: string;
  edges: {
    source: string;
    target: string;
    type?: string;
    data?: Edge;
    id: string;
    style?: React.CSSProperties;
  }[];
}

export async function createEdgeInBackground(
  data: CreateEdgeTaskData
): Promise<void> {
  // Create a new Promise that resolves immediately
  Promise.resolve().then(async () => {
    try {
      if (!data.taskFlowId) {
        throw new Error("Task flow ID is required");
      }

      const response = await fetch(`/api/taskflows/${data.taskFlowId}/edges`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: data.id,
          source: data.source,
          target: data.target,
          type: data.type || "default",
          data: data.data || {},
        }),
      });

      if (!response.ok) {
        console.error(
          "Failed to create edge in background:",
          await response.text()
        );
      }
    } catch (error) {
      console.error("Error creating edge in background:", error);
    }
  });

  // Return immediately without waiting for the background task
  return;
}

export async function createBulkEdgesInBackground(
  data: CreateBulkEdgesTaskData
): Promise<void> {
  Promise.resolve().then(async () => {
    try {
      if (!data.taskFlowId || !data.edges || data.edges.length === 0) {
        throw new Error("Task flow ID and edges are required");
      }

      const response = await fetch(
        `/api/taskflows/${data.taskFlowId}/edges/bulk`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            edges: data.edges.map((edge) => ({
              id: edge.id,
              source: edge.source,
              target: edge.target,
              type: edge.type || "default",
              data: edge.data || {},
              style: edge.style || {},
            })),
          }),
        }
      );

      if (!response.ok) {
        console.error(
          "Failed to create bulk edges in background:",
          await response.text()
        );
      }
    } catch (error) {
      console.error("Error creating bulk edges in background:", error);
    }
  });

  return;
}

interface DeleteEdgeTaskData {
  taskFlowId: string;
  edgeIds: string[];
}

export async function deleteEdgeInBackground(
  data: DeleteEdgeTaskData
): Promise<void> {
  // Create a new Promise that resolves immediately
  Promise.resolve().then(async () => {
    try {
      if (!data.taskFlowId || !data.edgeIds || data.edgeIds.length === 0) {
        throw new Error("Task flow ID and edge IDs are required");
      }

      const response = await fetch(
        `/api/taskflows/${data.taskFlowId}/edges?edgeIds=${data.edgeIds.join(
          ","
        )}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        console.error(
          "Failed to delete edge in background:",
          await response.text()
        );
      }
    } catch (error) {
      console.error("Error deleting edge in background:", error);
    }
  });

  // Return immediately without waiting for the background task
  return;
}
