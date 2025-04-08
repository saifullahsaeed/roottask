import { Button } from "@/components/ui";
import { Plus } from "lucide-react";
import { CreateTeamDialog } from "@/components/teams/CreateTeamDialog";
import { Team, TeamWithRelations } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";

interface SelectTeamProps {
  teams: Team[];
  showCreateTeam: boolean;
  setShowCreateTeam: (show: boolean) => void;
  onTeamCreated: (team: TeamWithRelations) => void;
  onTeamSelect: (team: TeamWithRelations) => void;
}

export function SelectTeam({
  teams,
  showCreateTeam,
  setShowCreateTeam,
  onTeamCreated,
  onTeamSelect,
}: SelectTeamProps) {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-semibold">Select a Team</h2>
        <p className="mt-2 text-muted-foreground">
          Choose a team to get started
        </p>
        <div className="mt-4 flex items-center justify-center gap-4">
          <Select
            onValueChange={(value) => {
              const team = teams.find((t) => t.id === value);
              if (team) onTeamSelect(team);
            }}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select a team" />
            </SelectTrigger>
            <SelectContent>
              {teams.map((team) => (
                <SelectItem key={team.id} value={team.id}>
                  {team.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={() => setShowCreateTeam(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Team
          </Button>
        </div>
      </div>
      <CreateTeamDialog
        open={showCreateTeam}
        onOpenChange={setShowCreateTeam}
        onTeamCreated={onTeamCreated}
      />
    </div>
  );
}
