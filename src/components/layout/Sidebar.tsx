"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter, usePathname } from "next/navigation";
import { Plus, Users, Puzzle, Star, StarOff, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui";
import { CreateProjectDialog } from "@/components/dashboard/CreateProjectDialog";
import type { Project } from "@prisma/client";
import React, { useState, useMemo } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu/dropdown-menu";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [search, setSearch] = useState("");
  const [pinned, setPinned] = useState<string[]>([]);
  const [showCreateProject, setShowCreateProject] = useState(false);

  const { data: projects, isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const response = await fetch("/api/projects");
      if (!response.ok) throw new Error("Failed to fetch projects");
      return response.json();
    },
  });

  // Filter and sort projects
  const filteredProjects = useMemo(() => {
    if (!projects) return [];
    return projects.filter((p: Project) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [projects, search]);

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
      className={`relative group flex items-center w-full pl-4 pr-2 py-1.5 rounded-md transition-all duration-100 text-left text-sm truncate cursor-pointer
        ${
          isActive
            ? "border-l-4 border-primary bg-primary/10 font-semibold text-primary shadow-sm"
            : "border-l-4 border-transparent text-muted-foreground hover:bg-accent/30 hover:shadow-sm"
        }
        focus:outline-none`}
      onClick={() => router.push(`/dashboard/projects/${project.id}`)}
      tabIndex={0}
      role="button"
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ")
          router.push(`/dashboard/projects/${project.id}`);
      }}
    >
      <span className="truncate flex-1">{project.name}</span>
      {/* Star and More buttons: show on hover or if active */}
      <span
        className={`flex items-center gap-1 ml-2 transition-opacity duration-100 ${
          isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        }`}
      >
        <button
          className={`p-1 rounded hover:text-yellow-500 ${
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
            <Star className="h-4 w-4 fill-yellow-400" />
          ) : (
            <StarOff className="h-4 w-4" />
          )}
        </button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="p-1">
              <MoreVertical className="h-4 w-4" />
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
      </span>
    </div>
  );

  return (
    <aside className="w-64 h-full border-r border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex flex-col">
      {/* Top: Create Project and Search */}
      <div className="p-3 border-b border-border">
        <Button
          className="w-full"
          variant="default"
          size="sm"
          onClick={() => setShowCreateProject(true)}
        >
          <Plus className="h-4 w-4 mr-1" />
          Create Project
        </Button>
        <CreateProjectDialog
          open={showCreateProject}
          onOpenChange={setShowCreateProject}
        />
      </div>
      <div className="px-4 pt-4 pb-1">
        <span className="text-[10px] font-semibold text-muted-foreground tracking-widest uppercase">
          Projects
        </span>
      </div>
      <div className="px-4 pb-2">
        <input
          type="text"
          placeholder="Search projects..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-md border border-border bg-background px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
      <nav className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-24">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            {/* Pinned Projects */}
            {pinnedProjects.length > 0 && (
              <>
                <ul className="space-y-1 mb-2">
                  {pinnedProjects.map((project: Project) => (
                    <li key={project.id}>
                      <ProjectRow
                        project={project}
                        isActive={pathname?.includes(`/projects/${project.id}`)}
                        isPinned={true}
                      />
                    </li>
                  ))}
                </ul>
                {otherProjects.length > 0 && (
                  <div className="px-4 py-1">
                    <div className="h-px bg-border/60" />
                  </div>
                )}
              </>
            )}
            {/* Other Projects */}
            <ul className="space-y-1">
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
              <div className="text-muted-foreground text-xs text-center py-8">
                No projects found.
              </div>
            )}
          </>
        )}
      </nav>
      {/* Sticky bottom: Teams and Plugins */}
      <div className="sticky bottom-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t border-border z-10">
        {/* Teams Section */}
        <div className="px-4 pt-4 pb-1">
          <span className="text-[10px] font-semibold text-muted-foreground tracking-widest uppercase">
            Teams
          </span>
        </div>
        <nav className="mb-2">
          <ul>
            <li>
              <button
                className={`w-full flex items-center px-4 py-2 rounded-md transition-colors text-left text-sm font-medium
                  ${
                    pathname?.startsWith("/dashboard/teams")
                      ? "text-primary bg-accent/40"
                      : "text-muted-foreground hover:bg-accent/30"
                  }
                  focus:outline-none
                `}
                onClick={() => router.push("/dashboard/teams")}
              >
                <Users className="h-4 w-4 mr-2" />
                All Teams
              </button>
            </li>
          </ul>
        </nav>
        {/* Plugins Section */}
        <div className="px-4 pt-2 pb-1">
          <span className="text-[10px] font-semibold text-muted-foreground tracking-widest uppercase">
            Plugins
          </span>
        </div>
        <nav className="mb-2">
          <ul>
            <li>
              <button
                className={`w-full flex items-center px-4 py-2 rounded-md transition-colors text-left text-sm font-medium
                  ${
                    pathname?.startsWith("/dashboard/plugins")
                      ? "text-primary bg-accent/40"
                      : "text-muted-foreground hover:bg-accent/30"
                  }
                  focus:outline-none
                `}
                onClick={() => router.push("/dashboard/plugins")}
              >
                <Puzzle className="h-4 w-4 mr-2" />
                Plugin Marketplace
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  );
}
