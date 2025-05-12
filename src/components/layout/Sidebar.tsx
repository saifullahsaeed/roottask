"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter, usePathname } from "next/navigation";
import {
  Plus,
  Users,
  Puzzle,
  Star,
  StarOff,
  MoreVertical,
  Search,
  Circle,
  FolderOpen,
  Layers,
  User,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui";
import { CreateProjectDialog } from "@/components/dashboard/CreateProjectDialog";
import type { Project } from "@prisma/client";
import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [search, setSearch] = useState("");
  const [pinned, setPinned] = useState<string[]>([]);
  const [showCreateProject, setShowCreateProject] = useState(false);

  const { data: projects, isLoading } = useQuery({
    queryKey: ["projects", search],
    queryFn: async () => {
      const url = search.trim()
        ? `/api/projects?search=${encodeURIComponent(search)}`
        : "/api/projects";
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch projects");
      return response.json();
    },
  });

  // Filter and sort projects
  const filteredProjects = projects || [];
  const pinnedProjects = filteredProjects.filter((p: Project) =>
    pinned.includes(p.id)
  );
  const otherProjects = filteredProjects.filter(
    (p: Project) => !pinned.includes(p.id)
  );

  const togglePin = (id: string) => {
    setPinned((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  const ProjectRow = ({
    project,
    isActive,
    isPinned,
  }: {
    project: Project;
    isActive: boolean;
    isPinned: boolean;
  }) => (
    <div
      className={`relative group flex items-center w-full pl-3 pr-1 py-1 rounded-md transition-all duration-100 text-left text-xs cursor-pointer
        ${
          isActive
            ? "border-l-4 border-primary bg-primary/10 font-semibold text-primary shadow-sm"
            : "border-l-4 border-transparent text-muted-foreground hover:bg-accent/40 hover:shadow-sm"
        }
        focus:outline-none`}
      onClick={() => router.push(`/dashboard/projects/${project.id}`)}
      tabIndex={0}
      role="button"
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ")
          router.push(`/dashboard/projects/${project.id}`);
      }}
      title={project.name}
    >
      {/* Status dot */}
      <span className={`mr-1`}>
        <Circle
          className={`h-2 w-2 ${
            project.status === "ACTIVE"
              ? "text-blue-500"
              : project.status === "COMPLETED"
              ? "text-green-500"
              : project.status === "ON_HOLD"
              ? "text-yellow-500"
              : "text-muted-foreground"
          }`}
          fill="currentColor"
        />
      </span>
      <span className="truncate flex-1 text-xs">{project.name}</span>
      {/* Pin always visible, tooltip */}
      <button
        className={`p-0.5 rounded hover:text-yellow-500 ml-1 ${
          isPinned ? "text-yellow-500" : "text-muted-foreground"
        }`}
        onClick={(e) => {
          e.stopPropagation();
          togglePin(project.id);
        }}
        title={isPinned ? "Unpin project" : "Pin project"}
        tabIndex={-1}
      >
        {isPinned ? (
          <Star className="h-3 w-3 fill-yellow-400" />
        ) : (
          <StarOff className="h-3 w-3" />
        )}
      </button>
      {/* More menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="p-0.5 ml-1"
            title="Project options"
          >
            <MoreVertical className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Project Options</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => {}}>Rename</DropdownMenuItem>
          <DropdownMenuItem onClick={() => {}}>Delete</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => {}}>
            Project Settings
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );

  return (
    <aside className="w-64 h-full flex flex-col bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-2 py-4 shadow-2xl z-50">
      {/* Projects Section */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2 px-2">
          <span className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-widest">
            <Layers className="h-3 w-3 text-primary" /> Projects
          </span>
          <Button
            className="h-7 px-2 text-xs"
            variant="default"
            size="sm"
            onClick={() => setShowCreateProject(true)}
          >
            <Plus className="h-3 w-3 mr-1" />
            New
          </Button>
        </div>
        <div className="relative mb-2 px-2">
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-md border border-border bg-background px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-primary pl-7"
          />
          <Search className="absolute left-4 top-2 h-3 w-3 text-muted-foreground" />
        </div>
        <nav className="flex-1 overflow-y-auto px-1">
          {isLoading ? (
            <div className="space-y-1.5 px-1">
              {/* Section header skeleton */}
              <div className="px-2 mb-1">
                <Skeleton className="h-2.5 w-12" />
              </div>

              {/* Project skeletons - first group (pinned-like) */}
              {[1, 2].map((i) => (
                <div
                  key={`pinned-${i}`}
                  className="flex items-center w-full pl-3 pr-1 py-1 rounded-md border-l-4 border-primary/30"
                >
                  <Skeleton className="h-2 w-2 rounded-full mr-1" />
                  <Skeleton className="h-3 w-24 flex-1" />
                  <div className="flex items-center gap-1">
                    <Skeleton className="h-3 w-3 rounded-sm ml-1" />
                    <Skeleton className="h-3 w-3 rounded-sm ml-1" />
                  </div>
                </div>
              ))}

              {/* Divider skeleton */}
              <div className="py-1 px-2">
                <Skeleton className="h-px w-full opacity-40" />
              </div>

              {/* Project skeletons - second group */}
              {[1, 2, 3].map((i) => (
                <div
                  key={`regular-${i}`}
                  className="flex items-center w-full pl-3 pr-1 py-1 rounded-md border-l-4 border-transparent"
                >
                  <Skeleton className="h-2 w-2 rounded-full mr-1" />
                  <Skeleton className="h-3 w-28 flex-1" />
                  <div className="flex items-center gap-1">
                    <Skeleton className="h-3 w-3 rounded-sm ml-1" />
                    <Skeleton className="h-3 w-3 rounded-sm ml-1" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {pinnedProjects.length > 0 && (
                <>
                  <div className="text-[10px] text-muted-foreground font-semibold uppercase px-2 mb-1">
                    Pinned
                  </div>
                  <ul className="space-y-0.5 mb-1.5">
                    {pinnedProjects.map((project: Project) => (
                      <li key={project.id}>
                        <ProjectRow
                          project={project}
                          isActive={pathname?.includes(
                            `/projects/${project.id}`
                          )}
                          isPinned={true}
                        />
                      </li>
                    ))}
                  </ul>
                  {otherProjects.length > 0 && (
                    <div className="py-1">
                      <div className="h-px bg-border/60" />
                    </div>
                  )}
                </>
              )}
              <ul className="space-y-0.5">
                {otherProjects.map((project: Project) => (
                  <li key={project.id}>
                    <ProjectRow
                      project={project}
                      isActive={pathname?.includes(`/projects/${project.id}`)}
                      isPinned={false}
                    />
                  </li>
                ))}
              </ul>
              {filteredProjects.length === 0 && (
                <div className="flex flex-col items-center justify-center py-6 text-center text-muted-foreground">
                  <FolderOpen className="h-6 w-6 mb-1" />
                  <span className="text-xs font-medium">No projects found</span>
                  <span className="text-[10px]">
                    Try a different search or create a new project.
                  </span>
                </div>
              )}
            </>
          )}
        </nav>
        <CreateProjectDialog
          open={showCreateProject}
          onOpenChange={setShowCreateProject}
        />
      </div>
      {/* Absolute bottom bar for Teams, Plugins, Settings, Profile */}
      <div className="absolute bottom-0 left-0 w-full bg-background/95 border-t border-border z-50 flex items-center justify-end gap-2 py-2 pr-2">
        <button
          className={`flex flex-col items-center justify-center p-2 rounded-md hover:bg-accent/40 transition-colors ${
            pathname?.startsWith("/dashboard/teams")
              ? "text-primary bg-accent/40"
              : "text-muted-foreground"
          }`}
          onClick={() => router.push("/dashboard/teams")}
          title="Teams"
        >
          <Users className="h-5 w-5" />
          <span className="text-[10px] mt-1">Teams</span>
        </button>
        <button
          className={`flex flex-col items-center justify-center p-2 rounded-md hover:bg-accent/40 transition-colors ${
            pathname?.startsWith("/dashboard/plugins")
              ? "text-primary bg-accent/40"
              : "text-muted-foreground"
          }`}
          onClick={() => router.push("/dashboard/plugins")}
          title="Plugins"
        >
          <Puzzle className="h-5 w-5" />
          <span className="text-[10px] mt-1">Plugins</span>
        </button>
        <button
          className="flex flex-col items-center justify-center p-2 rounded-md hover:bg-accent/40 transition-colors text-muted-foreground"
          onClick={() => alert("Settings (not implemented)")}
          title="Settings"
        >
          <Settings className="h-5 w-5" />
          <span className="text-[10px] mt-1">Settings</span>
        </button>
        <button
          className="flex flex-col items-center justify-center p-2 rounded-md hover:bg-accent/40 transition-colors text-muted-foreground"
          onClick={() => alert("Profile (not implemented)")}
          title="Profile"
        >
          <User className="h-5 w-5" />
          <span className="text-[10px] mt-1">Profile</span>
        </button>
      </div>
    </aside>
  );
}
