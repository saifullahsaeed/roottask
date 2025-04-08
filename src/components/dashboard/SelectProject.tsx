import { Button } from "@/components/ui";
import { Plus } from "lucide-react";
import { CreateProjectDialog } from "@/components/projects/CreateProjectDialog";
import { ProjectWithRelations } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";

interface SelectProjectProps {
  projects: ProjectWithRelations[];
  showCreateProject: boolean;
  setShowCreateProject: (show: boolean) => void;
  onProjectCreated: (project: ProjectWithRelations) => void;
  onProjectSelect: (project: ProjectWithRelations) => void;
}

export function SelectProject({
  projects,
  showCreateProject,
  setShowCreateProject,
  onProjectCreated,
  onProjectSelect,
}: SelectProjectProps) {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-semibold">Select a Project</h2>
        <p className="mt-2 text-muted-foreground">
          Choose a project to get started
        </p>
        <div className="mt-4 flex items-center justify-center gap-4">
          <Select
            onValueChange={(value) => {
              const project = projects.find((p) => p.id === value);
              if (project) onProjectSelect(project);
            }}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select a project" />
            </SelectTrigger>
            <SelectContent>
              {projects.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={() => setShowCreateProject(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </div>
      </div>
      <CreateProjectDialog
        open={showCreateProject}
        onOpenChange={setShowCreateProject}
        onProjectCreated={onProjectCreated}
      />
    </div>
  );
}
