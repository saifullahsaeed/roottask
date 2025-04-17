"use client";

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
} from "@/components/command/command";
import { Bell, Search, ChevronDown, Folder, Plus } from "lucide-react";
import { ProfileDropdown } from "@/components/layout/navbar/ProfileDropdown";
import { useState, useEffect } from "react";
import { useAppStore } from "@/stores/useAppStore";
import { Project } from "@/types";
import { CreateProjectDialog } from "@/components/projects/CreateProjectDialog";
import { useProjectStore } from "@/stores/useProjectStore";
export function Navbar() {
  const { selectedTeam, selectedProject, setSelectedProject, projects } =
    useAppStore();
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [open, setOpen] = useState(false);
  const { reset, setProject } = useProjectStore();

  const handleProjectSelect = (project: Project) => {
    // Update app store
    setSelectedProject(project);
    // Reset project store and set new project
    reset();
    setProject(project);
  };

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleProjectCreated = (newProject: Project) => {
    // Set the new project as selected in both stores
    handleProjectSelect(newProject);
  };

  if (!selectedTeam) {
    return null; // Don't render navbar if no team is selected
  }

  return (
    <>
      <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="relative flex h-14 items-center px-4">
          {/* Left side - Logo and Projects */}
          <div className="absolute left-4 flex items-center gap-4">
            <h1 className="text-xl font-bold text-primary">Card Tree</h1>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 font-medium"
                >
                  <Folder className="h-4 w-4" />
                  <span>{selectedProject?.name || "Select Project"}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-64">
                <div className="px-2 py-1.5 text-sm font-medium text-muted-foreground">
                  Projects
                </div>
                {projects?.map((project) => (
                  <DropdownMenuItem
                    key={project.id}
                    className="flex items-center gap-2"
                    onClick={() => handleProjectSelect(project)}
                  >
                    <Folder className="h-4 w-4" />
                    {project.name}
                    {selectedProject?.id === project.id && (
                      <span className="ml-auto text-primary">✓</span>
                    )}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuItem
                  className="text-primary font-medium"
                  onClick={() => {
                    setShowCreateProject(true);
                    reset();
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create New Project
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Center - Search */}
          <div className="mx-auto w-full max-w-2xl">
            <div className="relative">
              <Button
                variant="outline"
                className="w-full justify-start text-sm text-muted-foreground"
                onClick={() => setOpen(true)}
              >
                <Search className="mr-2 h-4 w-4" />
                Search cards... (⌘K)
              </Button>
            </div>
          </div>

          {/* Right side - Notifications and Profile */}
          <div className="absolute right-4 flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <ProfileDropdown />
          </div>
        </div>
      </nav>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Quick Actions">
            <CommandItem onSelect={() => setShowCreateProject(true)}>
              <span>Create New Project</span>
              <CommandShortcut>⌘P</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <span>Create New Task</span>
              <CommandShortcut>⌘T</CommandShortcut>
            </CommandItem>
          </CommandGroup>
          <CommandGroup heading="Recent Projects">
            {projects?.map((project) => (
              <CommandItem
                key={project.id}
                onSelect={() => {
                  handleProjectSelect(project);
                  setOpen(false);
                }}
              >
                <Folder className="mr-2 h-4 w-4" />
                <span>{project.name}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>

      <CreateProjectDialog
        open={showCreateProject}
        onOpenChange={setShowCreateProject}
        onProjectCreated={handleProjectCreated}
      />
    </>
  );
}
