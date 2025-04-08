import { Button } from "@/components/ui";
import { Plus } from "lucide-react";
import { CreateProjectDialog } from "@/components/projects/CreateProjectDialog";
import { ProjectWithRelations, TeamWithRelations } from "@/types";

interface CreateProjectProps {
  team: TeamWithRelations;
  showCreateProject: boolean;
  setShowCreateProject: (show: boolean) => void;
  onProjectCreated: (project: ProjectWithRelations) => void;
}

export function CreateProject({
  team,
  showCreateProject,
  setShowCreateProject,
  onProjectCreated,
}: CreateProjectProps) {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-semibold">Create Your First Project</h2>
        <p className="mt-2 text-muted-foreground">
          Get started by creating a project in {team.name}
        </p>
        <Button onClick={() => setShowCreateProject(true)} className="mt-4">
          <Plus className="mr-2 h-4 w-4" />
          Create Project
        </Button>
      </div>
      <CreateProjectDialog
        open={showCreateProject}
        onOpenChange={setShowCreateProject}
        onProjectCreated={onProjectCreated}
      />
    </div>
  );
}
