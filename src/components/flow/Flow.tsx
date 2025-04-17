import { useRef } from "react";
import ReactFlow, {
  Background,
  BackgroundVariant,
  NodeTypes,
  EdgeTypes,
  ReactFlowInstance,
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

const nodeTypes: NodeTypes = {
  [NODE_TYPES.CARD]: CardNode,
};

const edgeTypes: EdgeTypes = {
  [EDGE_TYPES.CUSTOM]: CustomEdge,
};

interface FlowProps {
  onCreateTask: () => void;
}

export function Flow({ onCreateTask }: FlowProps) {
  const flowRef = useRef<ReactFlowInstance | null>(null);
  const {
    nodes,
    edges,
    isLayoutLocked,
    selectedNode,
    isSnapToGrid,
    onNodesChange,
    onEdgesChange,
    toggleLayoutLock,
    toggleSnapToGrid,
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
      padding: 0.5,
      duration: 250,
    });
  };

  const handleReset = () => {
    if (selectedNode) {
    } else {
      flowRef.current?.fitBounds(
        {
          x: 200,
          y: 200,
          width: 1600,
          height: 600,
        },
        {
          duration: 250,
        }
      );
    }
  };

  return (
    <Box className="h-full relative">
      <ReactFlow
        onInit={(instance) => (flowRef.current = instance)}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
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
            console.log("Recalculating node positions");
            recalculateNodePositions();
          }}
        />
        <Background
          gap={BACKGROUND.gap}
          size={BACKGROUND.size}
          variant={BackgroundVariant.Dots}
        />
      </ReactFlow>
    </Box>
  );
}
