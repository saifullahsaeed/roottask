import { useHotkeys } from "react-hotkeys-hook";

interface UseFlowHotkeysProps {
  handleZoomIn: () => void;
  handleZoomOut: () => void;
  handleFitView: () => void;
  handleToggleLayoutLock: () => void;
  handleToggleSnapToGrid: () => void;
  handleReset: () => void;
}

export function useFlowHotkeys({
  handleZoomIn,
  handleZoomOut,
  handleFitView,
  handleToggleLayoutLock,
  handleToggleSnapToGrid,
  handleReset,
}: UseFlowHotkeysProps) {
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
}
