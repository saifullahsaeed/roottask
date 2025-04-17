import { useCallback, useRef, useState } from "react";
import { ReactFlowInstance } from "reactflow";

export function useFlowControls() {
  const [isLayoutLocked, setIsLayoutLocked] = useState(true);
  const [isSnapToGrid, setIsSnapToGrid] = useState(true);
  const [isTaskDetailsVisible, setIsTaskDetailsVisible] = useState(true);
  const reactFlowInstance = useRef<ReactFlowInstance | null>(null);

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

  const toggleTaskDetails = useCallback(() => {
    setIsTaskDetailsVisible((prev) => !prev);
  }, []);

  return {
    isLayoutLocked,
    isSnapToGrid,
    isTaskDetailsVisible,
    reactFlowInstance,
    onInit,
    handleZoomIn,
    handleZoomOut,
    handleFitView,
    handleToggleLayoutLock,
    handleToggleSnapToGrid,
    handleReset,
    toggleTaskDetails,
  };
}
