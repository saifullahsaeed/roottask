import { Handle, HandleProps, Position } from "reactflow";
import { cn } from "@/lib/utils";
import {
  ArrowBigRightDash,
  ArrowBigLeftDash,
  AlertCircle,
  Plus,
} from "lucide-react";
import { useState, useRef } from "react";
import { EDGE_TYPES } from "../edges/EdgeTypes";
import { CreateTaskModal } from "../controls/CreateTaskModal";

interface CustomHandleProps extends Omit<HandleProps, "type"> {
  handleType: "source" | "target";
  onConnectionTypeChange?: (type: string) => void;
  nodeId: string;
}

interface ModalData {
  connectionType?: string;
  isSource?: boolean;
}

export function CustomHandle({
  handleType,
  onConnectionTypeChange,
  nodeId,
  ...props
}: CustomHandleProps) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState<ModalData>({});
  const [hoveredOption, setHoveredOption] = useState<string | null>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const handleOptionClick = (type: string) => {
    onConnectionTypeChange?.(type);
    setIsPopoverOpen(false);
    setModalData({
      connectionType: type,
      isSource: handleType === "source",
    });
    setIsModalOpen(true);
  };

  const handleMouseLeave = (e: React.MouseEvent) => {
    if (!popoverRef.current?.contains(e.relatedTarget as Node)) {
      closeTimeoutRef.current = setTimeout(() => {
        setIsPopoverOpen(false);
        setHoveredOption(null);
      }, 200);
    }
  };

  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    setIsPopoverOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setModalData({});
  };

  return (
    <>
      <Handle
        {...props}
        type={handleType}
        position={handleType === "source" ? Position.Right : Position.Left}
        className={cn(
          "!w-5 !h-5",
          "transition-all duration-200",
          "!flex !items-center !justify-center",
          "!rounded-full",
          "!z-50",
          "bottom-4",
          "border-gray-500",
          handleType === "target"
            ? cn("group", "!-translate-x-2")
            : cn("group", "!translate-x-2")
        )}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={(e) => {
          e.stopPropagation();
          if (handleType === "source") {
            setModalData({
              connectionType: EDGE_TYPES.NEXT_TASK,
              isSource: handleType === "source",
            });
            setIsModalOpen(true);
          } else {
            setIsModalOpen(true);
          }
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <Plus className="w-3 h-3 text-amber-500 group-hover:text-amber-600" />
        </div>
      </Handle>

      {isPopoverOpen && (
        <div
          ref={popoverRef}
          className={cn(
            "absolute",
            handleType === "source" ? "left-full ml-2" : "right-full mr-2",
            "top-1/2",
            "-translate-y-1/2",
            "p-1",
            "rounded-md",
            "bg-background",
            "border",
            "border-border",
            "shadow-lg",
            "z-50",
            "flex",
            "flex-col",
            "gap-1"
          )}
          onClick={(e) => e.stopPropagation()}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="relative">
            <button
              onMouseEnter={() => setHoveredOption("optional")}
              onMouseLeave={() => setHoveredOption(null)}
              onClick={(e) => {
                e.stopPropagation();
                handleOptionClick(EDGE_TYPES.OPTIONAL_NEXT);
              }}
              className={cn(
                "p-1.5 rounded-md",
                "transition-all duration-200",
                "hover:bg-primary/10",
                "text-primary hover:text-primary/90",
                "flex items-center justify-center",
                "w-8 h-8",
                "bg-background",
                "border border-border/40",
                "hover:border-primary/40",
                "hover:shadow-sm"
              )}
            >
              {handleType === "source" ? (
                <ArrowBigRightDash className="w-4 h-4" />
              ) : (
                <ArrowBigLeftDash className="w-4 h-4" />
              )}
            </button>
            {hoveredOption === "optional" && (
              <div
                className={cn(
                  "absolute",
                  handleType === "source"
                    ? "left-full ml-1"
                    : "right-full mr-1",
                  "top-1/2",
                  "-translate-y-1/2",
                  "px-2 py-1",
                  "text-xs",
                  "rounded",
                  "bg-background",
                  "border",
                  "border-border",
                  "shadow-md",
                  "whitespace-nowrap"
                )}
              >
                Optional Next Task
              </div>
            )}
          </div>
          <div className="relative">
            <button
              onMouseEnter={() => setHoveredOption("blocked")}
              onMouseLeave={() => setHoveredOption(null)}
              onClick={(e) => {
                e.stopPropagation();
                handleOptionClick(EDGE_TYPES.BLOCKED);
              }}
              className={cn(
                "p-1.5 rounded-md",
                "transition-all duration-200",
                "hover:bg-destructive/10",
                "text-destructive hover:text-destructive/90",
                "flex items-center justify-center",
                "w-8 h-8",
                "bg-background",
                "border border-border/40",
                "hover:border-destructive/40",
                "hover:shadow-sm"
              )}
            >
              <AlertCircle className="w-4 h-4" />
            </button>
            {hoveredOption === "blocked" && (
              <div
                className={cn(
                  "absolute",
                  handleType === "source"
                    ? "left-full ml-1"
                    : "right-full mr-1",
                  "top-1/2",
                  "-translate-y-1/2",
                  "px-2 py-1",
                  "text-xs",
                  "rounded",
                  "bg-background",
                  "border",
                  "border-border",
                  "shadow-md",
                  "whitespace-nowrap"
                )}
              >
                Blocked Task
              </div>
            )}
          </div>
        </div>
      )}

      <CreateTaskModal
        opened={isModalOpen}
        onClose={handleModalClose}
        sourceNodeId={modalData.isSource ? nodeId : undefined}
        initialConnectionType={modalData.connectionType}
      />
    </>
  );
}
