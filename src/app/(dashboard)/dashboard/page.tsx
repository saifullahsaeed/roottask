"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui";
import {
  Plus,
  User,
  Layers,
  List,
  AlertTriangle,
  Activity,
  Users,
  Star,
  StarOff,
  FolderOpen,
} from "lucide-react";
import { CreateProjectDialog } from "@/components/dashboard/CreateProjectDialog";
import { useRouter } from "next/navigation";
import type { DashboardProject } from "@/types";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu/dropdown-menu";

const dummyTeams = [
  { id: "t1", name: "Design Team" },
  { id: "t2", name: "Development Team" },
];

const dummyActivity = [
  {
    id: "a1",
    type: "task",
    text: "Task 'Wireframe Home Page' completed",
    time: "2 hours ago",
    project: "Website Redesign",
  },
  {
    id: "a2",
    type: "project",
    text: "Project 'Mobile App Launch' put on hold",
    time: "1 day ago",
    project: "Mobile App Launch",
  },
  {
    id: "a3",
    type: "task",
    text: "Task 'Setup CI/CD' assigned to you",
    time: "3 days ago",
    project: "Marketing Campaign",
  },
];

const statusColors: Record<string, string> = {
  ACTIVE: "bg-blue-100 text-blue-800",
  COMPLETED: "bg-green-100 text-green-800",
  ON_HOLD: "bg-yellow-100 text-yellow-800",
  INACTIVE: "bg-gray-100 text-gray-800",
  ARCHIVED: "bg-zinc-200 text-zinc-800",
};

export default function DashboardPage() {
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [tab, setTab] = useState("all");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [pinned, setPinned] = useState<string[]>([]); // project ids
  const router = useRouter();

  // Fetch projects from API, refetch when statusFilter changes
  const { data: projects = [], isLoading } = useQuery<DashboardProject[]>({
    queryKey: ["projects", statusFilter],
    queryFn: async () => {
      const url =
        statusFilter && statusFilter !== "ALL"
          ? `/api/projects?status=${encodeURIComponent(statusFilter)}`
          : "/api/projects";
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch projects");
      return response.json();
    },
  });

  // Project tabs
  const allProjects = projects;
  const pinnedProjects = projects.filter((p) => pinned.includes(p.id));
  const recentProjects = [...projects]
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
    .slice(0, 3);

  const projectsToShow =
    tab === "all"
      ? allProjects
      : tab === "pinned"
      ? pinnedProjects
      : recentProjects;

  // Status filter
  const filteredProjects = projectsToShow.filter(
    (p) => statusFilter === "ALL" || p.status === statusFilter
  );

  const handlePin = (id: string) => {
    setPinned((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-muted/50 to-white dark:from-zinc-900/60 dark:to-zinc-950 pb-32">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 pt-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground mt-2 text-base">
              Welcome back! Here&apos;s what&apos;s happening in your workspace.
            </p>
          </div>
        </div>
        {/* Purposeful Quick Stats */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-4 mb-10 px-4 sm:px-8">
          <div className="rounded-xl bg-white dark:bg-zinc-900 shadow p-5 flex flex-col items-center">
            <List className="h-6 w-6 text-primary mb-2" />
            <div className="text-2xl font-bold">12</div>
            <div className="text-xs text-muted-foreground">My Open Tasks</div>
          </div>
          <div className="rounded-xl bg-white dark:bg-zinc-900 shadow p-5 flex flex-col items-center">
            <AlertTriangle className="h-6 w-6 text-yellow-500 mb-2" />
            <div className="text-2xl font-bold">3</div>
            <div className="text-xs text-muted-foreground">Tasks Due Soon</div>
          </div>
          <div className="rounded-xl bg-white dark:bg-zinc-900 shadow p-5 flex flex-col items-center">
            <Activity className="h-6 w-6 text-blue-500 mb-2" />
            <div className="text-2xl font-bold">2</div>
            <div className="text-xs text-muted-foreground">
              Recently Updated Projects
            </div>
          </div>
          <div className="rounded-xl bg-white dark:bg-zinc-900 shadow p-5 flex flex-col items-center">
            <Layers className="h-6 w-6 text-muted-foreground mb-2" />
            <div className="text-2xl font-bold">1</div>
            <div className="text-xs text-muted-foreground">
              Projects With No Task Flows
            </div>
          </div>
        </div>
        {/* Projects Section with Tabs */}
        <div className="max-w-6xl mx-auto mb-12 px-4 sm:px-8">
          <div className="flex items-center gap-4 mb-4 justify-between">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-semibold tracking-tight">Projects</h2>
              <div className="flex gap-2">
                <button
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    tab === "all"
                      ? "bg-primary text-white"
                      : "bg-muted text-muted-foreground"
                  }`}
                  onClick={() => setTab("all")}
                >
                  All
                </button>
                <button
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    tab === "pinned"
                      ? "bg-primary text-white"
                      : "bg-muted text-muted-foreground"
                  }`}
                  onClick={() => setTab("pinned")}
                >
                  Pinned
                </button>
                <button
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    tab === "recent"
                      ? "bg-primary text-white"
                      : "bg-muted text-muted-foreground"
                  }`}
                  onClick={() => setTab("recent")}
                >
                  Recent
                </button>
              </div>
              {/* Status Filter DropdownMenu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="ml-4 min-w-[140px] justify-between"
                  >
                    {(() => {
                      switch (statusFilter) {
                        case "ACTIVE":
                          return "Active";
                        case "COMPLETED":
                          return "Completed";
                        case "ON_HOLD":
                          return "On Hold";
                        case "INACTIVE":
                          return "Inactive";
                        case "ARCHIVED":
                          return "Archived";
                        default:
                          return "All Statuses";
                      }
                    })()}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuRadioGroup
                    value={statusFilter}
                    onValueChange={setStatusFilter}
                  >
                    <DropdownMenuRadioItem value="ALL">
                      All Statuses
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="ACTIVE">
                      Active
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="COMPLETED">
                      Completed
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="ON_HOLD">
                      On Hold
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="INACTIVE">
                      Inactive
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="ARCHIVED">
                      Archived
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <Button onClick={() => setShowCreateProject(true)}>
              <Plus className="h-4 w-4 mr-2" /> Create Project
            </Button>
          </div>
          {isLoading ? (
            <div className="text-center py-20 text-muted-foreground">
              Loading projects...
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <FolderOpen className="h-12 w-12 mb-4 text-muted-foreground" />
              <h3 className="text-2xl font-semibold mb-2">No projects found</h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                Projects help you organize your work. Get started by creating
                your first project.
              </p>
              <Button size="lg" onClick={() => setShowCreateProject(true)}>
                <Plus className="h-4 w-4 mr-2" /> Create Project
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className="rounded-xl bg-white dark:bg-zinc-900 shadow p-5 flex flex-col gap-2 relative group border border-transparent hover:border-primary transition"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className="font-semibold text-lg truncate group-hover:underline cursor-pointer"
                      onClick={() =>
                        router.push(`/dashboard/projects/${project.id}`)
                      }
                    >
                      {project.name}
                    </span>
                    <button
                      className="ml-2 p-1 rounded hover:text-yellow-500"
                      onClick={() => handlePin(project.id)}
                      title={
                        pinned.includes(project.id)
                          ? "Unpin project"
                          : "Pin project"
                      }
                    >
                      {pinned.includes(project.id) ? (
                        <Star className="h-5 w-5 fill-yellow-400 text-yellow-500" />
                      ) : (
                        <StarOff className="h-5 w-5 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                  <div className="flex gap-2 items-center mb-1">
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium ${
                        statusColors[project.status]
                      }`}
                    >
                      {project.status.replace("_", " ")}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <User className="h-3 w-3" />
                      {project.createdByUser?.name ||
                        project.createdByUser?.email}
                    </span>
                  </div>
                  <div className="flex gap-2 flex-wrap text-xs text-muted-foreground mb-2">
                    <span
                      className="flex items-center gap-1"
                      title="Task Flows"
                    >
                      <Layers className="h-3 w-3" /> {project.taskFlowCount}{" "}
                      flows
                    </span>
                    <span className="flex items-center gap-1" title="Tasks">
                      <List className="h-3 w-3" /> {project.taskCount} tasks
                    </span>
                    <span
                      className="flex items-center gap-1"
                      title="Last activity"
                    >
                      <Activity className="h-3 w-3" />{" "}
                      {new Date(project.lastActivity).toLocaleDateString()}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    className="w-full mt-2"
                    onClick={() =>
                      router.push(`/dashboard/projects/${project.id}`)
                    }
                  >
                    View Project
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Recent Activity */}
        <div className="max-w-6xl mx-auto mb-12 px-4 sm:px-8">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold tracking-tight">
              Recent Activity
            </h2>
          </div>
          {dummyActivity.length === 0 ? (
            <div className="text-muted-foreground text-center py-12">
              <span>No recent activity.</span>
            </div>
          ) : (
            <ul className="divide-y divide-border rounded-xl bg-white dark:bg-zinc-900 shadow overflow-hidden">
              {dummyActivity.map((activity) => (
                <li
                  key={activity.id}
                  className="px-4 py-3 flex items-center gap-3"
                >
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary">
                    {activity.type === "task" ? (
                      <List className="h-4 w-4" />
                    ) : (
                      <Layers className="h-4 w-4" />
                    )}
                  </span>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{activity.text}</div>
                    <div className="text-xs text-muted-foreground">
                      {activity.project} • {activity.time}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        {/* Teams Section */}
        <div className="max-w-6xl mx-auto mb-24 px-4 sm:px-8">
          <div className="flex items-center gap-2 mb-4">
            <Users className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold tracking-tight">Teams</h2>
          </div>
          {dummyTeams.length === 0 ? (
            <div className="text-muted-foreground text-center py-12">
              <span>You are not part of any teams yet.</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dummyTeams.map((team) => (
                <div
                  key={team.id}
                  className="rounded-xl bg-white dark:bg-zinc-900 shadow p-5 flex flex-col gap-2 border border-transparent hover:border-primary transition cursor-pointer"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-5 w-5 text-primary" />
                    <span className="font-semibold text-base">{team.name}</span>
                  </div>
                  <Button
                    size="sm"
                    className="w-full mt-2"
                    variant="outline"
                    onClick={() => router.push(`/dashboard/teams/${team.id}`)}
                  >
                    View Team
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <CreateProjectDialog
        open={showCreateProject}
        onOpenChange={setShowCreateProject}
      />
    </div>
  );
}
