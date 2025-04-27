import { TaskForNode } from "@/types";
import {
  Node,
  Edge,
  NodeChange,
  EdgeChange,
  NodeProps,
  Connection,
} from "reactflow";

export interface FlowNode extends Node<TaskForNode> {
  id: string; // Frontend-generated node ID
  data: TaskForNode;
}

// Store Types
export interface FlowState {
  taskFlowId: string;
  // Nodes and edges state
  nodes: FlowNode[];
  edges: Edge[];
  selectedNodeId: string | null;

  // Flow controls state
  isLayoutLocked: boolean;
  isSnapToGrid: boolean;
  isTaskDetailsVisible: boolean;
  selectedNode: FlowNode | null;
}

export interface FlowActions {
  setTaskFlowId: (taskFlowId: string) => void;
  recalculateNodePositions: () => void;
  // Resetting of the store for new task flow
  resetStore: () => void;
}

export interface NodeActions {
  setNodes: (nodes: FlowNode[]) => void;
  onNodesChange: (changes: NodeChange[]) => void;
  updateNode: (id: string, data: TaskForNode) => void;
  addNode: (id: string, data: TaskForNode) => void;
  deleteNode: (id: string) => void;
}

export interface EdgeActions {
  setEdges: (edges: Edge[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (params: Connection | Edge) => void;
  deleteEdges: (ids: string[]) => void;
}

export interface FlowControlActions {
  setSelectedNodeId: (id: string | null) => void;
  toggleLayoutLock: () => void;
  toggleSnapToGrid: () => void;
  toggleTaskDetails: (nodeId: string | null) => void;
  setSelectedNode: (node: FlowNode | null) => void;
}

// Component Props Types
export interface TaskFlowProps {
  team_id: string;
  project_id: string;
}

export interface TaskDetailsProps {
  node: Node<TaskForNode> | null;
}

// Constants Types
export interface BackgroundConfig {
  gap: number;
  size: number;
}

export interface NodeTypes {
  [key: string]: React.ComponentType<NodeProps<TaskForNode>>;
}
