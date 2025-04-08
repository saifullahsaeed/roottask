import { LayoutGrid, Plus } from "lucide-react";
import { Button } from "../ui/button/Button";
import { useCreateStatuses } from "@/hooks/useStatuses";
import { Project } from "@/types";
interface NoStatusExistProps {
  selectedProject: Project;
  handleAddStatus: () => void;
}

export function NoStatusExist({
  selectedProject,
  handleAddStatus,
}: NoStatusExistProps) {
  const {
    mutate: createDefaultStatuses,
    isPending: isCreatingDefaultStatuses,
  } = useCreateStatuses(selectedProject?.id);
  return (
    <div className="h-full flex flex-col items-center justify-center p-8">
      <div className="rounded-full bg-primary/10 p-4 mb-4">
        <LayoutGrid className="h-10 w-10 text-primary" />
      </div>
      <h2 className="text-2xl font-semibold text-center mb-2">
        Welcome to Your Project Board
      </h2>
      <p className="text-muted-foreground text-center max-w-md mb-6">
        Your board is ready to help you visualize and manage your project
        workflow. Create status columns to organize tasks and track progress at
        a glance.
      </p>
      <div className="flex flex-row items-center gap-4 mb-4">
        <Button
          size="lg"
          className="gap-2"
          onClick={() =>
            createDefaultStatuses({
              statuses: [
                { name: "To Do", position: 0 },
                { name: "In Progress", position: 1 },
                { name: "Done", position: 2 },
              ],
            })
          }
          disabled={isCreatingDefaultStatuses}
        >
          <Plus className="h-5 w-5" />
          <span>
            {isCreatingDefaultStatuses ? "Setting Up..." : "Set Up Your Board"}
          </span>
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="gap-2"
          onClick={handleAddStatus}
        >
          <Plus className="h-5 w-5" />
          <span>Add Status</span>
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        We&apos;ll create standard columns: &quot;To Do&quot;, &quot;In
        Progress&quot;, and &quot;Done&quot;
      </p>
    </div>
  );
}
