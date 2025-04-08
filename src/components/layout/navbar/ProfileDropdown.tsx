"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from "@/components/ui";
import { Button } from "@/components/ui";
import { User, Settings, Activity, LogOut, Plus, Users } from "lucide-react";
import { ThemeSwitcher } from "@/components/common";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { User as UserType } from "next-auth";
import { useState } from "react";
import { CreateTeamDialog } from "@/components/teams/CreateTeamDialog";
import { TeamWithRelations } from "@/types";
import { useAppStore } from "@/stores/useAppStore";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface UserWithImage extends UserType {
  image?: string | null;
}

export function ProfileDropdown() {
  const { data: session } = useSession();
  const user = session?.user as UserWithImage | undefined;
  const [isCreateTeamOpen, setIsCreateTeamOpen] = useState(false);
  const {
    selectedTeam,
    teams,
    setSelectedTeam,
    setProjects,
    setSelectedProject,
  } = useAppStore();
  const queryClient = useQueryClient();

  const handleTeamSelect = (team: TeamWithRelations) => {
    setSelectedTeam(team);
    setProjects(team.projects ?? []);
    if (team.projects && team.projects.length > 0) {
      setSelectedProject(team.projects[0]);
    } else {
      setSelectedProject(null);
    }
  };

  const handleTeamCreated = async (newTeam: TeamWithRelations) => {
    try {
      // First, close the dialog
      setIsCreateTeamOpen(false);

      // Invalidate the teams query
      await queryClient.invalidateQueries({ queryKey: ["teams"] });

      // Update the local state
      setSelectedTeam(newTeam);
      setProjects(newTeam.projects || []); // Handle case where projects might be undefined

      // Update selected project if there are any projects
      if (newTeam.projects && newTeam.projects.length > 0) {
        setSelectedProject(newTeam.projects[0]);
      } else {
        setSelectedProject(null);
      }
    } catch (error) {
      console.error("Error handling team creation:", error);
      // Optionally show an error toast
      toast.error("Failed to update team state");
    }
  };
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            {user?.image ? (
              <Image
                src={user.image}
                alt={user.name || "User avatar"}
                fill
                className="rounded-full object-cover"
              />
            ) : (
              <User className="h-5 w-5" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user?.name}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user?.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="flex items-center">
              <Users className="mr-2 h-4 w-4" />
              <span>Teams</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent className="w-56">
                {teams?.map((team) => (
                  <DropdownMenuItem
                    key={team.id}
                    className="flex items-center justify-between"
                    onClick={() => handleTeamSelect(team)}
                  >
                    <span>{team.name}</span>
                    {selectedTeam?.id === team.id && (
                      <span className="text-primary">✓</span>
                    )}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-primary"
                  onClick={() => setIsCreateTeamOpen(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  <span>Create Team</span>
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>

          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Activity className="mr-2 h-4 w-4" />
            <span>Activity</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <div className="px-2 py-1.5">
            <ThemeSwitcher />
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-red-600 cursor-pointer"
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <CreateTeamDialog
        open={isCreateTeamOpen}
        onOpenChange={setIsCreateTeamOpen}
        onTeamCreated={handleTeamCreated}
      />
    </>
  );
}
