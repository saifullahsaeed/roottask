"use client";

import { useCallback, useRef, useState } from "react";
import ReactFlow, {
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  NodeChange,
  applyNodeChanges,
  BackgroundVariant,
  NodeTypes,
  ReactFlowInstance,
} from "reactflow";
import { useHotkeys } from "react-hotkeys-hook";
import "reactflow/dist/style.css";
import { MiniMapWidget } from "./MiniMapWidget";
import { BottomControls } from "./BottomControls";
import { CardNode } from "./nodes/CardNode";
import { NODE_TYPES, BACKGROUND } from "./constants";

const nodeTypes: NodeTypes = {
  [NODE_TYPES.CARD]: CardNode,
};

const initialNodes: Node[] = [
  {
    id: "1",
    type: NODE_TYPES.CARD,
    selectable: true,
    selected: true,
    deletable: true,
    data: {
      title:
        "Research Marketing campaign for new product Laucnch I next quarter",
      priority: "urgent",
      status: "in progress",
      dueDate: "Tomorrow",
      assignees: ["John", "Jane", "Jim"],
    },

    position: { x: 100, y: 400 },
  },
  {
    id: "2",
    type: NODE_TYPES.CARD,
    data: {
      title: "Create a new product Concept",
      assignee: "Mike",
    },
    position: { x: 500, y: 200 },
  },
  {
    id: "3",
    type: NODE_TYPES.CARD,
    data: {
      title: "Create Artwork for the campaign",
      priority: "urgent",
    },
    position: { x: 500, y: 400 },
  },
  {
    id: "4",
    type: NODE_TYPES.CARD,
    data: {
      title: "Set up the campaign",
      assignee: "Sarah",
    },
    position: { x: 500, y: 600 },
  },
  {
    id: "5",
    type: NODE_TYPES.CARD,
    data: {
      title: "Review the campaign",
      assignee: "Sarah",
    },
    position: { x: 900, y: 400 },
  },
  {
    id: "6",
    type: NODE_TYPES.CARD,
    data: {
      title: "Start the campaign",
    },
    position: { x: 1300, y: 400 },
  },
  {
    id: "7",
    type: NODE_TYPES.CARD,
    data: {
      title: "Monitor the campaign Performance",
    },
    position: { x: 1700, y: 400 },
  },
];

const initialEdges: Edge[] = [
  { id: "e1-2", source: "1", target: "2" },
  { id: "e1-3", source: "1", target: "3" },
  { id: "e1-4", source: "1", target: "4" },
  { id: "e1-7", source: "2", target: "5" },
  { id: "e1-6", source: "3", target: "5" },
  { id: "e1-5", source: "4", target: "5" },
  { id: "e1-8", source: "5", target: "6" },
  { id: "e1-9", source: "6", target: "7" },
];

interface TaskFlowProps {
  team_id: string;
  project_id: string;
}

export function TaskFlow({ team_id, project_id }: TaskFlowProps) {
  const [nodes, setNodes] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [isLayoutLocked, setIsLayoutLocked] = useState(true);
  const [isSnapToGrid, setIsSnapToGrid] = useState(true);
  const reactFlowInstance = useRef<ReactFlowInstance | null>(null);
  console.log(team_id, project_id);
  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      if (isLayoutLocked) return;
      setNodes((nds) => applyNodeChanges(changes, nds));
    },
    [setNodes, isLayoutLocked]
  );

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onInit = useCallback((instance: ReactFlowInstance) => {
    reactFlowInstance.current = instance;
  }, []);

  const handleZoomIn = useCallback(() => {
    if (reactFlowInstance.current) {
      reactFlowInstance.current.zoomIn();
    }
  }, []);

  const handleZoomOut = useCallback(() => {
    if (reactFlowInstance.current) {
      reactFlowInstance.current.zoomOut();
    }
  }, []);

  const handleFitView = useCallback(() => {
    if (reactFlowInstance.current) {
      reactFlowInstance.current.fitView();
    }
  }, []);

  const handleToggleLayoutLock = useCallback(() => {
    setIsLayoutLocked((prev) => !prev);
  }, []);

  const handleToggleSnapToGrid = useCallback(() => {
    setIsSnapToGrid((prev) => !prev);
  }, []);

  const handleReset = useCallback(() => {
    // Reset functionality will be added later
  }, []);

  // Add hotkeys with proper event handling
  useHotkeys(
    "ctrl+=",
    (e) => {
      e.preventDefault();
      handleZoomIn();
    },
    { enabled: true, preventDefault: true }
  );

  useHotkeys(
    "ctrl+-",
    (e) => {
      e.preventDefault();
      handleZoomOut();
    },
    { enabled: true, preventDefault: true }
  );

  useHotkeys(
    "ctrl+0",
    (e) => {
      e.preventDefault();
      handleFitView();
    },
    { enabled: true, preventDefault: true }
  );

  useHotkeys(
    "ctrl+l",
    (e) => {
      e.preventDefault();
      handleToggleLayoutLock();
    },
    { enabled: true, preventDefault: true }
  );

  useHotkeys(
    "ctrl+g",
    (e) => {
      e.preventDefault();
      handleToggleSnapToGrid();
    },
    { enabled: true, preventDefault: true }
  );

  useHotkeys(
    "ctrl+r",
    (e) => {
      e.preventDefault();
      handleReset();
    },
    { enabled: true, preventDefault: true }
  );

  return (
    <div className="w-full h-full relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={onInit}
        attributionPosition="top-left"
        nodeTypes={nodeTypes}
        minZoom={0.1}
        maxZoom={10}
        proOptions={{ hideAttribution: true }}
        snapToGrid={isSnapToGrid}
        snapGrid={[15, 15]}
        elevateEdgesOnSelect
        nodesDraggable={!isLayoutLocked}
      >
        <MiniMapWidget />
        <BottomControls
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onFitView={handleFitView}
          onToggleLayoutLock={handleToggleLayoutLock}
          onToggleSnapToGrid={handleToggleSnapToGrid}
          onReset={handleReset}
          isLayoutLocked={isLayoutLocked}
          isSnapToGrid={isSnapToGrid}
        />
        <Background
          gap={BACKGROUND.gap}
          size={BACKGROUND.size}
          variant={BackgroundVariant.Dots}
        />
      </ReactFlow>
    </div>
  );
}
