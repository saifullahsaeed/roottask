import { Button } from "@/components/ui";
import { Plus } from "lucide-react";
import { CreateTeamDialog } from "@/components/teams/CreateTeamDialog";
import { TeamWithRelations } from "@/types";

interface NoTeamsProps {
  showCreateTeam: boolean;
  setShowCreateTeam: (show: boolean) => void;
  onTeamCreated: (team: TeamWithRelations) => void;
}

export function NoTeams({
  showCreateTeam,
  setShowCreateTeam,
  onTeamCreated,
}: NoTeamsProps) {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-semibold">Welcome to CardTree</h2>
        <p className="mt-2 text-muted-foreground">
          Get started by creating your first team
        </p>
        <Button onClick={() => setShowCreateTeam(true)} className="mt-4">
          <Plus className="mr-2 h-4 w-4" />
          Create Team
        </Button>
      </div>
      <CreateTeamDialog
        open={showCreateTeam}
        onOpenChange={setShowCreateTeam}
        onTeamCreated={onTeamCreated}
      />
    </div>
  );
}
