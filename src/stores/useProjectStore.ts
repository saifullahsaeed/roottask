import {
  ProjectWithRelations,
  TaskStatusWithRelations,
  TaskWithRelations,
} from "@/types";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface ProjectStore {
  isLoading: boolean;
  project: ProjectWithRelations | null;
  statuses: TaskStatusWithRelations[] | null;
  tasks: TaskWithRelations[] | null;
  // Actions

  // Project
  setProject: (project: ProjectWithRelations) => void;

  // Statuses
  setStatuses: (statuses: TaskStatusWithRelations[]) => void;
  addStatus: (status: TaskStatusWithRelations) => void;
  removeStatus: (statusId: string) => void;
  updateStatus: (statusId: string, status: TaskStatusWithRelations) => void;

  // Tasks
  setTasks: (tasks: TaskWithRelations[]) => void;
  addTask: (task: TaskWithRelations) => void;
  removeTask: (taskId: string) => void;
  updateTask: (taskId: string, task: TaskWithRelations) => void;

  // State
  reset: () => void;
  setIsLoading: (isLoading: boolean) => void;
}

export const useProjectStore = create<ProjectStore>()(
  devtools((set) => ({
    // State
    isLoading: true,
    project: null,
    statuses: null,

    // Actions
    /*
    Project Setters to set the current active project
    */
    setProject: (project: ProjectWithRelations) => set({ project }),

    // Statuses
    /**
     * Set the current active project's statuses
     * UseCase: When the project is loaded from the database and the statuses are fetched
     * @param statuses - The statuses to set
     * @returns void
     */
    setStatuses: (statuses: TaskStatusWithRelations[]) => set({ statuses }),

    /**
     * Add a new status to the current active project
     * This method will add the status to the end of the array and sort the array by position
     * UseCase: When a new status is created from the UI
     * @param status - The status to add
     * @returns void
     */
    addStatus: (status: TaskStatusWithRelations) =>
      set((state: { statuses: TaskStatusWithRelations[] | null }) => ({
        statuses: [...(state.statuses || []), status].sort(
          (a, b) => a.position - b.position
        ),
      })),

    /**
     * Remove a status from the current active project and reorder the statuses
     * UseCase: When a status is deleted from the UI
     * @param statusId - The id of the status to remove
     * @returns void
     */
    removeStatus: (statusId: string) =>
      set((state: { statuses: TaskStatusWithRelations[] | null }) => ({
        statuses: state.statuses
          ?.filter((status) => status.id !== statusId)
          .sort((a, b) => a.position - b.position),
      })),

    /**
     * Update a status in the current active project and reorder the statuses
     * UseCase: When a status is updated from the UI e.g. name, color, position
     * @param statusId - The id of the status to update
     * @param status - The status to update
     * @returns void
     */
    updateStatus: (statusId: string, status: TaskStatusWithRelations) =>
      set((state: { statuses: TaskStatusWithRelations[] | null }) => ({
        statuses: state.statuses
          ?.map((s) => (s.id === statusId ? status : s))
          .sort((a, b) => a.position - b.position),
      })),

    // Tasks
    /**
     * Set the current active project's tasks
     * UseCase: When the project is loaded from the database and the tasks are fetched
     * @param tasks - The tasks to set
     * @returns void
     */
    setTasks: (tasks: TaskWithRelations[]) => set({ tasks }),

    /**
     * Add a new task to the current active project
     * UseCase: When a new task is created from the UI
     * @param task - The task to add
     * @returns void
     */
    addTask: (task: TaskWithRelations) =>
      set((state: { tasks: TaskWithRelations[] | null }) => ({
        tasks: [...(state.tasks || []), task],
      })),

    /**
     * Remove a task from the current active project
     * UseCase: When a task is deleted from the UI
     * @param taskId - The id of the task to remove
     * @returns void
     */
    removeTask: (taskId: string) =>
      set((state: { tasks: TaskWithRelations[] | null }) => ({
        tasks: state.tasks?.filter((t) => t.id !== taskId) || null,
      })),

    /**
     * Update a task in the current active project
     * UseCase: When a task is updated from the UI
     * @param taskId - The id of the task to update
     * @param task - The task to update
     * @returns void
     */
    updateTask: (taskId: string, task: TaskWithRelations) =>
      set((state: { tasks: TaskWithRelations[] | null }) => ({
        tasks: state.tasks?.map((t) => (t.id === taskId ? task : t)) || null,
      })),

    // State
    /**
     * Reset the current active project and statuses
     * UseCase: When the project is unloaded from the UI and also when the project is changed or a new one is selected it should be reset
     * @returns void
     */
    reset: () => set({ project: null, statuses: null, tasks: null }),

    /**
     * Set the loading state of the current active project
     * UseCase: When the project is loading from the database
     * @param isLoading - The loading state
     * @returns void
     */
    setIsLoading: (isLoading: boolean) => set({ isLoading }),
  }))
);
