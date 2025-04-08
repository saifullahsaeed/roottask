import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { TeamWithRelations, ProjectWithRelations } from "@/types";

interface AppState {
  selectedTeam: TeamWithRelations | null;
  selectedProject: ProjectWithRelations | null;
  teams: TeamWithRelations[] | null;
  projects: ProjectWithRelations[] | null;
  loading: boolean;
  setSelectedTeam: (team: TeamWithRelations | null) => void;
  setSelectedProject: (project: ProjectWithRelations | null) => void;
  setTeams: (teams: TeamWithRelations[]) => void;
  setProjects: (projects: ProjectWithRelations[]) => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
}

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set) => ({
        selectedTeam: null,
        selectedProject: null,
        teams: [],
        projects: [],
        loading: true,
        setSelectedTeam: (team) => set({ selectedTeam: team }),
        setSelectedProject: (project) => set({ selectedProject: project }),
        setTeams: (teams) => set({ teams }),
        setProjects: (projects) => set({ projects }),
        setLoading: (loading) => set({ loading }),
        reset: () =>
          set({
            selectedTeam: null,
            selectedProject: null,
            teams: [],
            projects: [],
          }),
      }),
      {
        name: "app-storage", // unique name for localStorage key
      }
    )
  )
);
