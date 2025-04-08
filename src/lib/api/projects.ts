import type { Project } from "@prisma/client";

export async function getProjects(teamId: string): Promise<Project[]> {
  const response = await fetch(
    `/api/projects?teamId=${encodeURIComponent(teamId)}`
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch projects");
  }
  return response.json();
}

export async function createProject(data: {
  name: string;
  description?: string;
  teamId: string;
}): Promise<Project> {
  const response = await fetch("/api/projects", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create project");
  }
  return response.json();
}
