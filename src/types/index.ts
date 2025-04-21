// Re-export all types
export * from "./models";

export type TaskFlow = {
  id: string;
  name: string;
  description: string | null;
  projectId: string;
  status: "active" | "completed" | "archived";
  createdAt: Date;
  updatedAt: Date;
};
