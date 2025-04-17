import { create } from "zustand";
import {
  Edge,
  NodeChange,
  EdgeChange,
  applyNodeChanges,
  applyEdgeChanges,
} from "reactflow";
import {
  FlowState,
  NodeActions,
  EdgeActions,
  FlowControlActions,
  FlowActions,
  FlowNode,
  TaskType,
} from "@/components/flow/types/flow.types";
import {
  deleteNodeInBackground,
  updateNodeInBackground,
  updateTaskInBackground,
} from "@/components/flow/bi/tasks";
import { devtools } from "zustand/middleware";
import { deleteEdgeInBackground } from "@/components/flow/bi/edges";
import { RecalculateNodePositions } from "../controls/PositionCalculator";

type Store = FlowState &
  FlowActions &
  NodeActions &
  EdgeActions &
  FlowControlActions;

export const useFlowStore = create<Store>()(
  devtools((set, get) => ({
    taskFlowId: "",
    // State
    nodes: [],
    edges: [],
    selectedNodeId: null,
    isLayoutLocked: false,
    isSnapToGrid: true,
    isTaskDetailsVisible: true,
    selectedNode: null,

    // Flow Actions
    setTaskFlowId: (taskFlowId: string) => set({ taskFlowId }),
    resetStore: () => set({ nodes: [], edges: [], selectedNodeId: null }),

    // Node Actions
    setNodes: (nodes: FlowNode[]) => set({ nodes }),
    onNodesChange: (changes: NodeChange[]) => {
      set({
        nodes: applyNodeChanges(changes, get().nodes),
      });
      changes.forEach((change) => {
        if (change.type === "position" && change.dragging) {
          updateNodeInBackground({
            taskFlowId: get().taskFlowId,
            nodeId: change.id,
            updates: {
              positionX: change.position?.x,
              positionY: change.position?.y,
            },
          });
        }
      });
    },
    updateNode: (id: string, data: TaskType) => {
      const taskId = data.id;
      set((state) => ({
        nodes: state.nodes.map((node) =>
          node.id === id ? { ...node, data: { ...node.data, ...data } } : node
        ),
      }));
      updateTaskInBackground({
        taskFlowId: get().taskFlowId,
        taskId: taskId,
        updates: data,
      });
    },
    addNode: (
      id: string,
      data: TaskType,
      type: string = "card",
      position: { x: number; y: number } = { x: 100, y: 100 }
    ) => {
      const newNode: FlowNode = {
        id: id,
        type: type,
        position: position,
        data: { ...data, id: id },
      };
      // Update UI immediately
      set((state) => ({
        nodes: [...state.nodes, newNode],
      }));
    },
    deleteNode: (id: string) => {
      // Get all edges connected to this node
      const connectedEdges = get().edges.filter(
        (edge) => edge.source === id || edge.target === id
      );

      // Remove the node and its connected edges from the state
      set((state) => ({
        nodes: state.nodes.filter((node) => node.id !== id),
        edges: state.edges.filter(
          (edge) => edge.source !== id && edge.target !== id
        ),
      }));

      // Delete the node and its edges in the background
      deleteNodeInBackground({ taskFlowId: get().taskFlowId, nodeId: id });
      if (connectedEdges.length > 0) {
        deleteEdgeInBackground({
          taskFlowId: get().taskFlowId,
          edgeIds: connectedEdges.map((edge) => edge.id),
        });
      }
    },

    // Edge Actions
    setEdges: (edges: Edge[]) => set({ edges }),
    onEdgesChange: (changes: EdgeChange[]) => {
      set({
        edges: applyEdgeChanges(changes, get().edges),
      });
    },
    onConnect: (params: Edge) => {
      // Check if edge already exists by source and target
      console.log("Adding edge:", params);
      const edgeExists = get().edges.some(
        (edge: Edge) =>
          edge.source === params.source && edge.target === params.target
      );

      if (edgeExists) {
        return; // Don't create duplicate edge
      }
      // Add the edge to the state
      set((state) => ({
        edges: [...state.edges, params as Edge],
      }));
    },

    deleteEdges: (ids: string[]) => {
      console.log("Deleting edges:", ids);
      set((state) => ({
        edges: state.edges.filter((edge) => !ids.includes(edge.id)),
      }));
      deleteEdgeInBackground({
        taskFlowId: get().taskFlowId,
        edgeIds: ids,
      });
    },

    // Flow Control Actions
    setSelectedNodeId: (id: string | null) => set({ selectedNodeId: id }),
    toggleLayoutLock: () =>
      set((state) => ({ isLayoutLocked: !state.isLayoutLocked })),
    toggleSnapToGrid: () =>
      set((state) => ({ isSnapToGrid: !state.isSnapToGrid })),
    toggleTaskDetails: (nodeId: string | null) => {
      const currentSelectedId = get().selectedNodeId;

      // If clicking the same node, toggle visibility
      if (currentSelectedId === nodeId) {
        set((state) => ({
          isTaskDetailsVisible: !state.isTaskDetailsVisible,
        }));
      } else {
        // If clicking a different node, always show details for the new node
        set({
          selectedNodeId: nodeId,
          isTaskDetailsVisible: true,
        });
      }
    },

    // Add new action for recalculating positions
    recalculateNodePositions: () => {
      console.log("Recalculating positions");
      const { nodes, edges } = get();
      console.log("Current nodes:", nodes);
      console.log("Current edges:", edges);

      if (nodes.length === 0) {
        console.log("No nodes to recalculate");
        return;
      }

      // Find the root node (node with no incoming edges)
      const rootNode = nodes.find(
        (node) => !edges.some((edge) => edge.target === node.id)
      );

      if (!rootNode) {
        console.log("No root node found");
        return;
      }

      console.log("Found root node:", rootNode);

      // Calculate new positions
      const newPositions = RecalculateNodePositions({
        currentNodePosition: {
          id: rootNode.id,
          x: rootNode.position.x,
          y: rootNode.position.y,
        },
        currentNodeEdges: edges,
      });

      console.log("New positions calculated:", newPositions);

      // Update node positions
      const updatedNodes = nodes.map((node) => {
        const newPosition = newPositions.find((pos) => pos.id === node.id);
        if (newPosition) {
          return {
            ...node,
            position: {
              x: newPosition.x,
              y: newPosition.y,
            },
          };
        }
        return node;
      });

      console.log("Updated nodes:", updatedNodes);
      set({ nodes: updatedNodes });
    },
  }))
);
