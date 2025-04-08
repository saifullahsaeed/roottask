import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Lock,
  Unlock,
  Grid,
  RotateCcw,
} from "lucide-react";
import { Tooltip } from "@/components/ui";

interface BottomControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitView: () => void;
  onToggleLayoutLock: () => void;
  onToggleSnapToGrid: () => void;
  onReset: () => void;
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
  isLayoutLocked,
  isSnapToGrid,
}: BottomControlsProps) {
  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
      <div className="bg-card border border-border rounded-xl shadow-lg p-1.5 flex items-center gap-1">
        <div className="flex items-center gap-1">
          <Tooltip
            content="Zoom out (Ctrl + -)"
            variant="dark"
            delayDuration={500}
          >
            <button
              className="p-2 rounded-lg hover:bg-muted active:scale-95 transition-all duration-200"
              onClick={onZoomOut}
            >
              <ZoomOut className="w-4.5 h-4.5 text-muted-foreground" />
            </button>
          </Tooltip>
          <Tooltip
            content="Zoom in (Ctrl + =)"
            variant="dark"
            delayDuration={500}
          >
            <button
              className="p-2 rounded-lg hover:bg-muted active:scale-95 transition-all duration-200"
              onClick={onZoomIn}
            >
              <ZoomIn className="w-4.5 h-4.5 text-muted-foreground" />
            </button>
          </Tooltip>
          <Tooltip
            content="Fit view (Ctrl + 0)"
            variant="dark"
            delayDuration={500}
          >
            <button
              className="p-2 rounded-lg hover:bg-muted active:scale-95 transition-all duration-200"
              onClick={onFitView}
            >
              <Maximize2 className="w-4.5 h-4.5 text-muted-foreground" />
            </button>
          </Tooltip>
        </div>

        <div className="h-4 w-px bg-border mx-0.5" />

        <div className="flex items-center gap-1">
          <Tooltip
            content={`${isLayoutLocked ? "Unlock" : "Lock"} layout (Ctrl + L)`}
            variant="dark"
            delayDuration={500}
          >
            <button
              className={`p-2 rounded-lg hover:bg-muted active:scale-95 transition-all duration-200 ${
                isLayoutLocked ? "bg-muted" : ""
              }`}
              onClick={onToggleLayoutLock}
            >
              {isLayoutLocked ? (
                <Lock className="w-4.5 h-4.5 text-muted-foreground" />
              ) : (
                <Unlock className="w-4.5 h-4.5 text-muted-foreground" />
              )}
            </button>
          </Tooltip>
          <Tooltip
            content={`${
              isSnapToGrid ? "Disable" : "Enable"
            } snap to grid (Ctrl + G)`}
            variant="dark"
            delayDuration={500}
          >
            <button
              className={`p-2 rounded-lg hover:bg-muted active:scale-95 transition-all duration-200 ${
                isSnapToGrid ? "bg-muted" : ""
              }`}
              onClick={onToggleSnapToGrid}
            >
              <Grid className="w-4.5 h-4.5 text-muted-foreground" />
            </button>
          </Tooltip>
          <Tooltip
            content="Reset layout (Ctrl + R)"
            variant="dark"
            delayDuration={500}
          >
            <button
              className="p-2 rounded-lg hover:bg-muted active:scale-95 transition-all duration-200"
              onClick={onReset}
            >
              <RotateCcw className="w-4.5 h-4.5 text-muted-foreground" />
            </button>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}
