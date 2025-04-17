import { useState } from "react";
import { BaseEdge, EdgeProps, getBezierPath, useReactFlow } from "reactflow";
import { Popover, Group, Stack, Tooltip } from "@mantine/core";
import {
  IconSettings,
  IconTrash,
  IconLink,
  IconLock,
} from "@tabler/icons-react";
import { EDGE_TYPES, EDGE_STYLES, type EdgeType } from "./EdgeTypes";
import { cn } from "@/lib/utils";

export function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
}: EdgeProps) {
  const { deleteElements, setEdges } = useReactFlow();
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const currentType = (data?.type as EdgeType) || EDGE_TYPES.NEXT_TASK;

  const handleDelete = () => {
    deleteElements({ edges: [{ id }] });
  };

  const handleTypeChange = (newType: EdgeType) => {
    setEdges((edges) =>
      edges.map((edge) =>
        edge.id === id
          ? {
              ...edge,
              data: { ...edge.data, type: newType },
              style: EDGE_STYLES[newType],
              markerEnd: newType === EDGE_TYPES.NEXT_TASK ? "arrow" : undefined,
            }
          : edge
      )
    );
    setIsPopoverOpen(false);
  };

  return (
    <>
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          ...style,
          ...EDGE_STYLES[currentType],
        }}
      />
      <Popover
        opened={isPopoverOpen}
        onChange={setIsPopoverOpen}
        position="top"
        withArrow
        shadow="md"
      >
        <Popover.Target>
          <div
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: "all",
              cursor: "pointer",
              zIndex: 10,
            }}
            onClick={() => setIsPopoverOpen(true)}
          >
            <button
              className={cn(
                "p-1.5 rounded-md",
                "transition-all duration-200",
                "hover:bg-primary",
                "text-primary",
                "flex items-center justify-center"
              )}
            >
              <IconSettings className="w-4 h-4" />
            </button>
          </div>
        </Popover.Target>
        <Popover.Dropdown className="!p-2.5 !bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80 !border-border">
          <Stack gap="xs">
            <Group gap="xs">
              <Tooltip label="Parent-Child" withArrow position="top">
                <button
                  onClick={() => handleTypeChange(EDGE_TYPES.NEXT_TASK)}
                  className={cn(
                    "p-2 rounded-md",
                    "transition-all duration-200",
                    "hover:bg-primary hover:text-white",
                    "text-primary",
                    "flex items-center justify-center",
                    currentType === EDGE_TYPES.NEXT_TASK && "bg-primary/10"
                  )}
                >
                  <IconLink className="w-4 h-4" />
                </button>
              </Tooltip>
              <Tooltip label="Related" withArrow position="top">
                <button
                  onClick={() => handleTypeChange(EDGE_TYPES.OPTIONAL_NEXT)}
                  className={cn(
                    "p-2 rounded-md",
                    "transition-all duration-200",
                    "hover:bg-primary hover:text-white",
                    "text-primary",
                    "flex items-center justify-center",
                    currentType === EDGE_TYPES.OPTIONAL_NEXT && "bg-primary/10"
                  )}
                >
                  <IconLink className="w-4 h-4" />
                </button>
              </Tooltip>
              <Tooltip label="Blocked" withArrow position="top">
                <button
                  onClick={() => handleTypeChange(EDGE_TYPES.BLOCKED)}
                  className={cn(
                    "p-2 rounded-md",
                    "transition-all duration-200",
                    "hover:bg-primary hover:text-white",
                    "text-primary",
                    "flex items-center justify-center",
                    currentType === EDGE_TYPES.BLOCKED && "bg-primary/10"
                  )}
                >
                  <IconLock className="w-4 h-4" />
                </button>
              </Tooltip>
              <Tooltip label="Delete" withArrow position="top">
                <button
                  onClick={handleDelete}
                  className={cn(
                    "p-2 rounded-md",
                    "transition-all duration-200",
                    "hover:bg-destructive hover:text-white",
                    "text-destructive",
                    "flex items-center justify-center"
                  )}
                >
                  <IconTrash className="w-4 h-4" />
                </button>
              </Tooltip>
            </Group>
          </Stack>
        </Popover.Dropdown>
      </Popover>
    </>
  );
}
