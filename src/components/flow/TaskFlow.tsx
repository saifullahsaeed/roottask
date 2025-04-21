"use client";

import { useMemo, useState, useEffect } from "react";
import { useFlowStore } from "@/components/flow/store/useFlowStore";
import { TaskDetails } from "@/components/flow/TaskDetails";
import { Flow } from "@/components/flow/Flow";
import { CreateTaskModal } from "./controls/CreateTaskModal";
import { useNodesHook } from "@/components/flow/hooks/useNodesHook";
import { useEdgesHook } from "@/components/flow/hooks/useEdgesHook";

export function TaskFlow({ taskFlowId }: { taskFlowId: string }) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const {
    selectedNodeId,
    nodes,
    isTaskDetailsVisible,
    toggleTaskDetails,
    setTaskFlowId,
    setNodes,
    setEdges,
  } = useFlowStore();
  const { nodes: nodesFromHook, isLoading } = useNodesHook(taskFlowId);
  const { edges: edgesFromHook, isLoading: edgesLoading } =
    useEdgesHook(taskFlowId);
  const selectedNode = useMemo(
    () =>
      selectedNodeId
        ? nodes.find((node) => node.id === selectedNodeId) || null
        : null,
    [selectedNodeId, nodes]
  );

  useEffect(() => {
    setTaskFlowId(taskFlowId);
    setNodes(nodesFromHook);
    setEdges(edgesFromHook);
  }, [
    taskFlowId,
    setTaskFlowId,
    setNodes,
    setEdges,
    nodesFromHook,
    edgesFromHook,
  ]);

  return (
    <div className="w-full h-[calc(100vh-3rem)] flex">
      {isLoading || edgesLoading ? (
        <div className="flex items-center justify-center w-full h-full">
          <div>Loading...</div>
        </div>
      ) : (
        <>
          {/* Task Details Section */}
          {selectedNode && isTaskDetailsVisible && (
            <div className="w-1/3 h-full border-r border-border/40">
              <TaskDetails
                node={selectedNode}
                taskflowId={taskFlowId}
                onClose={() => toggleTaskDetails(null)}
              />
            </div>
          )}

          {/* Flow Section */}
          <div
            className={`${
              selectedNode && isTaskDetailsVisible ? "w-2/3" : "w-full"
            } h-full flex flex-col`}
          >
            <div className="flex-1">
              <Flow
                taskFlowId={taskFlowId}
                onCreateTask={() => setIsCreateModalOpen(true)}
              />
            </div>
          </div>

          <CreateTaskModal
            opened={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
          />
        </>
      )}
    </div>
  );
}
