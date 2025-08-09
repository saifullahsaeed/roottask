import { useRef } from "react";
import ReactFlow, {
  Background,
  BackgroundVariant,
  NodeTypes,
  EdgeTypes,
  ReactFlowInstance,
  Connection,
  Edge,
  NodeDragHandler,
} from "reactflow";
import "reactflow/dist/style.css";
import { MiniMapWidget } from "@/components/flow/controls/MiniMapWidget";
import { BottomControls } from "@/components/flow/controls/BottomControls";
import { CardNode } from "@/components/flow/nodes/CardNode";
import { CustomEdge } from "@/components/flow/edges/CustomEdge";
import {
  NODE_TYPES,
  EDGE_TYPES,
  BACKGROUND,
} from "@/components/flow/constants";
import { useFlowStore } from "@/components/flow/store/useFlowStore";
import { Box } from "@mantine/core";
import { createEdgeInBackground } from "./bi/edges";
import { v4 as uuidv4 } from "uuid";
import { updateNodeInBackground } from "./bi/tasks";
const nodeTypes: NodeTypes = {
  [NODE_TYPES.CARD]: CardNode,
};

const edgeTypes: EdgeTypes = {
  [EDGE_TYPES.CUSTOM]: CustomEdge,
};

interface FlowProps {
  taskFlowId: string;
  onCreateTask: () => void;
}

export function Flow({ taskFlowId, onCreateTask }: FlowProps) {
  const flowRef = useRef<ReactFlowInstance | null>(null);
  const {
    nodes,
    edges,
    isLayoutLocked,
    selectedNode,
    isSnapToGrid,
    onNodesChange,
    setSelectedNode,
    onEdgesChange,
    toggleLayoutLock,
    toggleSnapToGrid,
    onConnect,
    deleteEdges,
    recalculateNodePositions,
  } = useFlowStore();

  const handleZoomIn = () => {
    flowRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    flowRef.current?.zoomOut();
  };

  const handleFitView = () => {
    flowRef.current?.fitView({
      padding: 0.2,
      duration: 250,
    });
  };

  const handleReset = () => {
    try {
      if (!flowRef.current) return;

      if (selectedNode) {
        // Center on selected node with appropriate zoom level
        const nodeWidth = 300; // Approximate node width
        const nodeHeight = 200; // Approximate node height
        const padding = 100; // Padding around the node

        flowRef.current.fitBounds(
          {
            x: selectedNode.position.x - padding,
            y: selectedNode.position.y - padding,
            width: nodeWidth + padding * 6,
            height: nodeHeight + padding * 4,
          },
          {
            duration: 250,
            padding: 0.5,
          }
        );
      } else {
        // Show all nodes with appropriate zoom level
        flowRef.current.fitBounds(
          {
            x: 200,
            y: 200,
            width: 1600,
            height: 600,
          },
          {
            duration: 250,
            padding: 0.1,
          }
        );
      }
    } catch (error) {
      console.error("Error resetting view:", error);
      // Fallback to default view
      flowRef.current?.fitView({ duration: 250 });
    }
  };

  const handleOnConnect = (params: Edge | Connection) => {
    if (!taskFlowId) {
      throw new Error("Task flow ID is required");
    }
    if (!params.source || !params.target) {
      throw new Error("Source and target are required");
    }
    const data = {
      id: `edge-${uuidv4()}`,
      taskFlowId: taskFlowId,
      source: params.source,
      target: params.target,
      type: EDGE_TYPES.CUSTOM,
      style: {
        stroke: "#2563eb", // Blue for next task
        strokeWidth: 2,
        strokeLinecap: "round" as const,
        strokeLinejoin: "round" as const,
      },
    };
    createEdgeInBackground(data);
    onConnect(data);
  };

  const handleOnNodeDragStop: NodeDragHandler = (event, node) => {
    updateNodeInBackground({
      taskFlowId: taskFlowId,
      nodeId: node.id,
      updates: {
        positionX: node.position.x,
        positionY: node.position.y,
      },
    });
  };

  return (
    <Box className="h-full relative">
      <ReactFlow
        onInit={(instance) => (flowRef.current = instance)}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onNodeDragStop={handleOnNodeDragStop}
        onEdgesChange={onEdgesChange}
        onConnect={handleOnConnect}
        onNodeClick={(event, node) => {
          setSelectedNode(node);
        }}
        attributionPosition="top-left"
        onEdgesDelete={(edges) => deleteEdges(edges.map((e) => e.id))}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
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
          onToggleLayoutLock={toggleLayoutLock}
          onToggleSnapToGrid={toggleSnapToGrid}
          onReset={handleReset}
          onCreateTask={onCreateTask}
          isLayoutLocked={isLayoutLocked}
          isSnapToGrid={isSnapToGrid}
          onRecalculatePositions={() => {
            recalculateNodePositions();
          }}
        />
        <Background
          gap={BACKGROUND.gap}
          size={BACKGROUND.size}
          variant={BackgroundVariant.Dots}
          className="bg-muted/30"
          color="gray"
        />
      </ReactFlow>
    </Box>
  );
}
