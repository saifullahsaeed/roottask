import { Handle, HandleProps, Position } from "reactflow";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { useState } from "react";
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
  nodeId,
  ...props
}: CustomHandleProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState<ModalData>({});
  const [isHovered, setIsHovered] = useState(false);

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
          "!w-6 !h-6",
          "transition-all duration-300 ease-in-out",
          "!flex !items-center !justify-center",
          "!rounded-full",
          "!z-50",
          "bottom-4",
          "border-2",
          "bg-white dark:bg-gray-800",
          "border-blue-400 dark:border-blue-300",
          "hover:border-blue-500 dark:hover:border-blue-200",
          "hover:scale-110",
          "shadow-sm hover:shadow-md",
          handleType === "target"
            ? cn("group", "!-translate-x-2")
            : cn("group", "!translate-x-2")
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
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
          <Plus
            className={cn(
              "w-4 h-4",
              "text-blue-400 dark:text-blue-300",
              "group-hover:text-blue-500 dark:group-hover:text-blue-200",
              "transition-transform duration-300",
              isHovered ? "scale-110" : "scale-100"
            )}
          />
        </div>
      </Handle>

      <CreateTaskModal
        opened={isModalOpen}
        onClose={handleModalClose}
        sourceNodeId={modalData.isSource ? nodeId : undefined}
        initialConnectionType={modalData.connectionType}
      />
    </>
  );
}
