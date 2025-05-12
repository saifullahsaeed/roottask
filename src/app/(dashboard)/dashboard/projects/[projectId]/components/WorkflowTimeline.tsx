import { Calendar, MoreHorizontal, Plus } from "lucide-react";
import { Button } from "@/components/ui";

interface Workflow {
  id: string;
  name: string;
  status: string;
  tasks: number;
  totalTasks: number;
  progress: number;
  start: string;
  end: string;
}

const workflows: Workflow[] = [
  {
    id: "1",
    name: "Workflow 1",
    status: "ACTIVE",
    tasks: 10,
    totalTasks: 10,
    progress: 100,
    start: "2024-05-01",
    end: "2024-05-05",
  },
];

export default function WorkflowTimeline() {
  if (workflows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Plus className="h-10 w-10 mb-4 text-zinc-300" />
        <h3 className="text-lg font-semibold mb-2 text-zinc-700 dark:text-zinc-200">
          No workflows found
        </h3>
        <p className="text-zinc-500 mb-6 max-w-md text-sm">
          Workflows help you organize your project. Get started by creating your
          first workflow.
        </p>
        <Button size="sm" className="h-8 px-3">
          <Plus className="h-4 w-4 mr-1" /> New Workflow
        </Button>
      </div>
    );
  }
  // Find min/max dates for the timeline axis
  const allDates = workflows.flatMap((wf: Workflow) => [wf.start, wf.end]);
  const minDate = allDates.reduce(
    (min: string, d: string) => (d < min ? d : min),
    allDates[0]
  );
  const maxDate = allDates.reduce(
    (max: string, d: string) => (d > max ? d : max),
    allDates[0]
  );
  return (
    <div className="w-full">
      <div className="flex items-center mb-4">
        <span className="text-xs text-zinc-400 mr-2 font-mono">{minDate}</span>
        <div className="flex-1 h-px bg-gradient-to-r from-zinc-200 via-blue-300 to-zinc-800 dark:from-zinc-800 dark:via-blue-900 dark:to-zinc-900" />
        <span className="text-xs text-zinc-400 ml-2 font-mono">{maxDate}</span>
      </div>
      <div className="space-y-6">
        {workflows.map((wf: Workflow) => (
          <div
            key={wf.id}
            className="flex items-center gap-4 min-h-10 relative group"
          >
            <div className="w-44 font-semibold text-sm truncate text-zinc-200 flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-primary" />
              {wf.name}
            </div>
            <div className="flex-1 relative h-4 flex items-center">
              {/* Timeline bar (mocked position/width) */}
              <div className="absolute left-0 right-0 h-2 bg-zinc-800 rounded-full" />
              <div
                className={`absolute h-2 rounded-full transition-all duration-500 ${
                  wf.progress === 100
                    ? "bg-gradient-to-r from-green-400 to-green-600"
                    : "bg-gradient-to-r from-blue-400 to-blue-600"
                }`}
                style={{ left: "10%", width: `${wf.progress}%` }}
              />
              <span className="absolute left-0 -top-6 text-xs text-zinc-400 font-mono">
                <Calendar className="h-3 w-3 inline-block mr-1" />
                {wf.start}
              </span>
              <span className="absolute right-0 -top-6 text-xs text-zinc-400 font-mono">
                <Calendar className="h-3 w-3 inline-block mr-1" />
                {wf.end}
              </span>
            </div>
            <span
              className={`px-2 py-0.5 rounded text-xs font-semibold border ${
                (wf.status === "TODO" && "border-red-500 text-red-500") ||
                (wf.status === "IN_PROGRESS" &&
                  "border-blue-500 text-blue-500") ||
                (wf.status === "DONE" && "border-green-500 text-green-500")
              }`}
            >
              {wf.status.replace("_", " ")}
            </span>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity ml-2">
              <button className="p-2 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-primary shadow">
                <MoreHorizontal className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
