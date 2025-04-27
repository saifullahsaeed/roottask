import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Lock,
  Unlock,
  Grid,
  RotateCcw,
  Plus,
  Layout,
} from "lucide-react";
import { Tooltip } from "@/components/ui";
import { Panel } from "reactflow";

interface BottomControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitView: () => void;
  onToggleLayoutLock: () => void;
  onToggleSnapToGrid: () => void;
  onReset: () => void;
  onCreateTask: () => void;
  onRecalculatePositions: () => void;
  isLayoutLocked: boolean;
  isSnapToGrid: boolean;
}

export function BottomControls({
  onZoomIn,
  onZoomOut,
  onFitView,
  onToggleLayoutLock,
  onToggleSnapToGrid,
  onReset,
  onCreateTask,
  onRecalculatePositions,
  isLayoutLocked,
  isSnapToGrid,
}: BottomControlsProps) {
  return (
    <Panel position="bottom-center">
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-2 rounded-xl border border-border shadow-lg flex items-center gap-2">
        <div className="flex items-center gap-2">
          <Tooltip content="Create new task" variant="dark">
            <button
              onClick={onCreateTask}
              className="p-2.5 rounded-lg transition-colors bg-primary/10 text-primary hover:bg-primary/20"
            >
              <Plus className="w-5 h-5" />
            </button>
          </Tooltip>
        </div>

        <div className="w-px h-8 bg-border mx-2" />

        <div className="flex items-center gap-2">
          <Tooltip content="Recalculate layout" variant="dark">
            <button
              onClick={onRecalculatePositions}
              className="p-2.5 rounded-lg transition-colors hover:bg-muted/80 text-foreground/80 hover:text-foreground"
            >
              <Layout className="w-5 h-5" />
            </button>
          </Tooltip>

          <Tooltip content="Zoom out (Ctrl + -)" variant="dark">
            <button
              onClick={onZoomOut}
              className="p-2.5 rounded-lg transition-colors hover:bg-muted/80 text-foreground/80 hover:text-foreground"
            >
              <ZoomOut className="w-5 h-5" />
            </button>
          </Tooltip>

          <Tooltip content="Zoom in (Ctrl + =)" variant="dark">
            <button
              onClick={onZoomIn}
              className="p-2.5 rounded-lg transition-colors hover:bg-muted/80 text-foreground/80 hover:text-foreground"
            >
              <ZoomIn className="w-5 h-5" />
            </button>
          </Tooltip>

          <Tooltip content="Fit view (Ctrl + 0)" variant="dark">
            <button
              onClick={onFitView}
              className="p-2.5 rounded-lg transition-colors hover:bg-muted/80 text-foreground/80 hover:text-foreground"
            >
              <Maximize2 className="w-5 h-5" />
            </button>
          </Tooltip>
        </div>

        <div className="w-px h-8 bg-border mx-2" />

        <div className="flex items-center gap-2">
          <Tooltip
            content={`${isLayoutLocked ? "Unlock" : "Lock"} layout (Ctrl + L)`}
            variant="dark"
          >
            <button
              onClick={onToggleLayoutLock}
              className={`p-2.5 rounded-lg transition-colors ${
                isLayoutLocked
                  ? "bg-primary/10 text-primary"
                  : "hover:bg-muted/80 text-foreground/80 hover:text-foreground"
              }`}
            >
              {isLayoutLocked ? (
                <Lock className="w-5 h-5" />
              ) : (
                <Unlock className="w-5 h-5" />
              )}
            </button>
          </Tooltip>

          <Tooltip
            content={`${
              isSnapToGrid ? "Disable" : "Enable"
            } snap to grid (Ctrl + G)`}
            variant="dark"
          >
            <button
              onClick={onToggleSnapToGrid}
              className={`p-2.5 rounded-lg transition-colors ${
                isSnapToGrid
                  ? "bg-primary/10 text-primary"
                  : "hover:bg-muted/80 text-foreground/80 hover:text-foreground"
              }`}
            >
              <Grid className="w-5 h-5" />
            </button>
          </Tooltip>

          <Tooltip content="Reset view" variant="dark">
            <button
              onClick={onReset}
              className="p-2.5 rounded-lg transition-colors hover:bg-muted/80 text-foreground/80 hover:text-foreground"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </Tooltip>
        </div>
      </div>
    </Panel>
  );
}
