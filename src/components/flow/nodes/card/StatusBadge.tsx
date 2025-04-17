import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui";
import { TaskStatus } from "@prisma/client";
import { getStatusIcon, getStatusColor } from "@/utils/status";

interface StatusBadgeProps {
  status: TaskStatus;
  onStatusChange: (status: TaskStatus) => void;
}

export function StatusBadge({ status, onStatusChange }: StatusBadgeProps) {
  const StatusIcon = getStatusIcon(status);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium transition-colors duration-200",
            getStatusColor(status),
            "cursor-pointer select-none"
          )}
        >
          {StatusIcon && <StatusIcon className="w-3 h-3" />}
          <span>{status}</span>
          <ChevronDown className="w-3 h-3 ml-0.5 opacity-50" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
        {Object.values(TaskStatus).map((statusKey) => {
          const StatusItemIcon = getStatusIcon(statusKey);
          return (
            <DropdownMenuItem
              key={statusKey}
              className={cn(
                "flex items-center gap-2 whitespace-normal",
                getStatusColor(statusKey),
                status === statusKey && "bg-muted"
              )}
              onClick={() => onStatusChange(statusKey)}
            >
              {StatusItemIcon && (
                <StatusItemIcon className="w-3.5 h-3.5 flex-shrink-0" />
              )}
              <span className="flex-1">{statusKey}</span>
              {status === statusKey && (
                <Check className="w-3.5 h-3.5 ml-auto flex-shrink-0" />
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
