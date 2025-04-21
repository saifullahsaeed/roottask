import {
  Node,
  Edge,
  NodeChange,
  EdgeChange,
  NodeProps,
  Connection,
} from "reactflow";
import { Task, User } from "@prisma/client";

// Node Data Types
export interface TaskType extends Task {
  assignees?: User[]; // Array of Assignees
  assigneesIds?: string[]; // Array of Assignee IDs
}

export interface FlowNode extends Node<TaskType> {
  id: string; // Frontend-generated node ID
  data: TaskType;
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
  updateNode: (id: string, data: TaskType) => void;
  addNode: (id: string, data: TaskType) => void;
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
  node: Node<TaskType> | null;
}

// Constants Types
export interface BackgroundConfig {
  gap: number;
  size: number;
}

export interface NodeTypes {
  [key: string]: React.ComponentType<NodeProps<TaskType>>;
}
