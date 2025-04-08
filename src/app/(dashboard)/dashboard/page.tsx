"use client";

import { useState, useEffect } from "react";
import { TaskFlow } from "@/components/flow/TaskFlow";
import { useQueryClient } from "@tanstack/react-query";
import { useAppStore } from "@/stores/useAppStore";
import { LoaderAnimated } from "@/components/ui";
import { Team, Project } from "@/types";
import { NoTeams } from "@/components/dashboard/NoTeams";
import { SelectTeam } from "@/components/dashboard/SelectTeam";
import { CreateProject } from "@/components/dashboard/CreateProject";
import { SelectProject } from "@/components/dashboard/SelectProject";
import { TabNavigation } from "@/components/dashboard/TabNavigation";
import { Board } from "@/components/board/Board";
import { ComingSoon } from "@/components/ui/ComingSoon";
import { useProjectStore } from "@/stores/useProjectStore";
import { useStatuses } from "@/hooks/useStatuses";
import { useTasks } from "@/hooks/useTasks";
// Loading Component
function Loading({ message }: { message: string }) {
  return (
    <div className="flex h-full items-center justify-center">
      <LoaderAnimated size={40} color="text-primary" message={message} />
    </div>
  );
}

export default function DashboardPage() {
  // Access global state and actions from Zustand stores
  const {
    selectedTeam,
    selectedProject,
    teams,
    projects,
    setSelectedTeam,
    setSelectedProject,
  } = useAppStore();

  const { isLoading: isProjectLoading, setProject } = useProjectStore();
  useStatuses(selectedProject?.id);
  useTasks(selectedProject!.id);
  // Local state for managing UI elements
  const [showCreateTeam, setShowCreateTeam] = useState(false);
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [activeTab, setActiveTab] = useState("board");

  // Access the React Query client
  const queryClient = useQueryClient();

  // Handlers
  function handleTeamCreated(newTeam: Team) {
    queryClient.invalidateQueries({ queryKey: ["teams"] });
    setSelectedTeam(newTeam);
    setShowCreateTeam(false);
  }

  function handleProjectCreated(newProject: Project) {
    setSelectedProject(newProject);
    setProject(newProject);
  }

  // Effects
  useEffect(
    function () {
      if (projects && projects.length > 0 && !selectedProject) {
        setSelectedProject(projects[0]);
      }
    },
    [projects, selectedProject, setSelectedProject]
  );

  if (!teams?.length) {
    return (
      <NoTeams
        showCreateTeam={showCreateTeam}
        setShowCreateTeam={setShowCreateTeam}
        onTeamCreated={handleTeamCreated}
      />
    );
  }

  if (!selectedTeam) {
    return (
      <SelectTeam
        teams={teams}
        showCreateTeam={showCreateTeam}
        setShowCreateTeam={setShowCreateTeam}
        onTeamCreated={handleTeamCreated}
        onTeamSelect={setSelectedTeam}
      />
    );
  }

  if (isProjectLoading) {
    return <Loading message="Loading..." />;
  }

  if (!projects?.length) {
    return (
      <CreateProject
        team={selectedTeam}
        showCreateProject={showCreateProject}
        setShowCreateProject={setShowCreateProject}
        onProjectCreated={handleProjectCreated}
      />
    );
  }

  if (!selectedProject) {
    return (
      <SelectProject
        projects={projects}
        showCreateProject={showCreateProject}
        setShowCreateProject={setShowCreateProject}
        onProjectCreated={handleProjectCreated}
        onProjectSelect={setSelectedProject}
      />
    );
  }

  if (isProjectLoading) {
    return <Loading message="Loading..." />;
  }

  // Render the main content
  return (
    <div className="h-full relative">
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      {activeTab === "flow" && (
        <TaskFlow team_id={selectedTeam.id} project_id={selectedProject.id} />
      )}
      {activeTab === "board" && selectedProject && (
        <Board selectedProject={selectedProject} />
      )}
      {activeTab === "calendar" && selectedProject && (
        <ComingSoon
          feature="Calendar View"
          description="A beautiful calendar view to manage your tasks and deadlines is coming soon!"
        />
      )}
      {activeTab === "list" && selectedProject && (
        <ComingSoon
          feature="List View"
          description="A powerful list view with advanced filtering and sorting capabilities is coming soon!"
        />
      )}
      {activeTab === "timeline" && selectedProject && (
        <ComingSoon
          feature="Timelines View"
          description="A timelines view to manage your tasks and deadlines is coming soon!"
        />
      )}
    </div>
  );
}
