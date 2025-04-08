"use client";

import { Navbar } from "@/components/layout/navbar";
import { LoaderAnimated } from "@/components/ui";
import { getTeams } from "@/lib/api/teams";
import { useAppStore } from "@/stores/useAppStore";
import { ProjectWithRelations } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const {
    loading,
    setLoading,
    selectedTeam,
    setSelectedTeam,
    setTeams,
    selectedProject,
    setSelectedProject,
    reset: resetAppStore,
    setProjects,
  } = useAppStore();
  const { data: session } = useSession();
  const handleTeamsQuery = async () => {
    setLoading(false);
    const teams = await getTeams();

    // If no teams, reset the app store
    if (teams.length === 0) {
      resetAppStore();
      setLoading(false);
      return teams;
    }

    // Set the teams
    setTeams(teams);

    // Select the first team if no team is selected yet
    if (!selectedTeam) {
      setSelectedTeam(teams[0]);
    } else {
      // If selected team exists in new teams, keep it selected, otherwise select the first team
      const existingTeam = teams.find((team) => team.id === selectedTeam.id);
      setSelectedTeam(existingTeam || teams[0]);
    }

    // Set the projects
    const currentTeam = selectedTeam || teams[0];
    const projects = currentTeam.projects ?? [];

    // If no projects, reset the projects and selected project
    if (projects.length === 0) {
      setSelectedProject(null);
      setProjects([]);
      setLoading(false);
      return teams;
    }
    // Set the projects
    setProjects(projects);

    // Select the first project if no project is selected yet
    if (!selectedProject) {
      setSelectedProject(projects[0]);
    } else {
      // If selected project exists in new projects, keep it selected
      const existingProject = projects.find(
        (project: ProjectWithRelations) => project.id === selectedProject.id
      );
      setSelectedProject(existingProject || projects[0]);
    }

    setLoading(false);
    return teams;
  };

  useQuery({
    queryKey: ["teams"],
    queryFn: handleTeamsQuery,
    enabled: !!session?.user,
  });
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoaderAnimated message="Loading..." />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 overflow-hidden">{children}</main>
    </div>
  );
}
