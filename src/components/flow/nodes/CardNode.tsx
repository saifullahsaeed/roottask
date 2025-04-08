import { Handle, Position } from "reactflow";
import { CARD } from "../constants";
import { CalendarClock, Flag } from "lucide-react";

interface CardNodeProps {
  data: {
    title: string;
    priority?: "urgent";
    dueDate?: string;
    assignee?: string;
  };
}

export function CardNode({ data }: CardNodeProps) {
  return (
    <>
      <Handle
        type="target"
        position={Position.Left}
        className="!bg-slate-400"
      />
      <div
        style={{ width: CARD.width, height: CARD.height }}
        className={`${CARD.padding} 
          bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 ${CARD.borderRadius}
          shadow-sm hover:shadow-lg transition-all duration-200
          group`}
      >
        {/* card header */}
        <div className="flex items-center justify-between mb-2 ">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
              TO DO
            </p>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
              Urgent
            </p>
          </div>
        </div>
        <div className="flex flex-col h-full">
          {/* Title row */}
          <div className="flex items-start gap-2 min-h-0 max-h-10">
            <p
              className="text-sm font-medium text-slate-900 dark:text-slate-100 line-clamp-2 flex-1 min-w-0
                group-hover:text-slate-800 dark:group-hover:text-slate-50 transition-colors duration-200"
            >
              {data.title}
            </p>
          </div>

          {/* Metadata row */}
          <div className="flex items-center justify-between mt-auto pt-1">
            <div
              className="flex items-center gap-1.5 text-2xs text-slate-500 dark:text-slate-400
                group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors duration-200"
            >
              <CalendarClock className="w-3.5 h-3.5" />
              <span>{data.dueDate || "Tomorrow"}</span>
            </div>
            <div className="flex items-center gap-2">
              {data.priority === "urgent" && (
                <Flag
                  className="text-red-500 !text-[11px] w-2.5 h-2.5
                    group-hover:scale-110 transition-transform duration-200"
                />
              )}
              {data.assignee ? (
                <div
                  className="w-[20px] h-[20px] rounded-full bg-slate-100 dark:bg-slate-700
                    flex items-center justify-center text-2xs text-slate-700 dark:text-slate-200
                    group-hover:bg-slate-200 dark:group-hover:bg-slate-600 transition-colors duration-200"
                >
                  {data.assignee.charAt(0).toUpperCase()}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        className="!bg-slate-400"
      />
    </>
  );
}
