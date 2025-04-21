"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Plus,
  Search,
  Filter,
  LayoutGrid,
  List,
  Activity,
  Clock,
  Users,
  FileText,
  ChevronRight,
  Sparkles,
  FolderKanban,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/";
import { Card, CardContent } from "@/components/ui/";
import { CreateProjectDialog } from "@/components/dashboard/CreateProjectDialog";
import type { Project } from "@prisma/client";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

export default function DashboardPage() {
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const router = useRouter();

  // Fetch projects with their taskflows
  const { data: projects, isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const response = await fetch("/api/projects");
      if (!response.ok) throw new Error("Failed to fetch projects");
      return response.json();
    },
  });

  const filteredProjects = projects?.filter((project: Project) => {
    return project.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const activeProjects = filteredProjects?.filter(
    (project: Project) => project.status.toLowerCase() === "active"
  );

  const otherProjects = filteredProjects?.filter(
    (project: Project) => project.status.toLowerCase() !== "active"
  );

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const handleProjectClick = (projectId: string) => {
    router.push(`/dashboard/projects/${projectId}`);
  };

  return (
    <div className="container mx-auto py-8">
      {/* Header Section */}
      <div className="flex flex-col space-y-6 mb-8">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Overview of your projects and activities
            </p>
          </div>
          <Button onClick={() => setShowCreateProject(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Project
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-0 hover:shadow-lg transition-all duration-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Urgent Tasks
                    </p>
                    <div className="flex items-center space-x-2">
                      <p className="text-2xl font-bold">8</p>
                      <Badge variant="destructive" className="text-xs">
                        Due Today
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3 text-destructive" />
                      <p className="text-xs text-muted-foreground">3 overdue</p>
                    </div>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-destructive" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card className="bg-gradient-to-br from-blue-500/5 to-blue-500/10 border-0 hover:shadow-lg transition-all duration-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Team Activity
                    </p>
                    <div className="flex items-center space-x-2">
                      <p className="text-2xl font-bold">12</p>
                      <Badge variant="secondary" className="text-xs">
                        Active Now
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-3 w-3 text-blue-500" />
                      <p className="text-xs text-muted-foreground">
                        3 in meetings
                      </p>
                    </div>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <Users className="h-5 w-5 text-blue-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card className="bg-gradient-to-br from-green-500/5 to-green-500/10 border-0 hover:shadow-lg transition-all duration-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Project Health
                    </p>
                    <div className="flex items-center space-x-2">
                      <p className="text-2xl font-bold">85%</p>
                      <Badge variant="default" className="text-xs">
                        On Track
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Activity className="h-3 w-3 text-green-500" />
                      <p className="text-xs text-muted-foreground">
                        +5% this week
                      </p>
                    </div>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
                    <Activity className="h-5 w-5 text-green-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <Card className="bg-gradient-to-br from-orange-500/5 to-orange-500/10 border-0 hover:shadow-lg transition-all duration-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Blocked Items
                    </p>
                    <div className="flex items-center space-x-2">
                      <p className="text-2xl font-bold">5</p>
                      <Badge variant="outline" className="text-xs">
                        Needs Review
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-1">
                      <AlertCircle className="h-3 w-3 text-orange-500" />
                      <p className="text-xs text-muted-foreground">
                        2 waiting for approval
                      </p>
                    </div>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-orange-500/10 flex items-center justify-center">
                    <AlertCircle className="h-5 w-5 text-orange-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 w-[300px]"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Active Projects Section */}
      {activeProjects && activeProjects.length > 0 && (
        <div className="space-y-6 mb-12">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Active Projects</h2>
            <Badge variant="outline" className="ml-2">
              {activeProjects.length}
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeProjects.map((project: Project, index: number) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card
                  className="group relative overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer hover:border-primary/50"
                  onClick={() => handleProjectClick(project.id)}
                >
                  {/* Background Pattern */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Top Section */}
                  <div className="relative p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                            <FileText className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-base">
                              {project.name}
                            </h3>
                            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              <span>
                                Created{" "}
                                {new Date(
                                  project.createdAt
                                ).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <Badge
                        variant="default"
                        className="text-xs bg-primary/10 text-primary"
                      >
                        Active
                      </Badge>
                    </div>
                  </div>

                  {/* Progress Section */}
                  <div className="relative px-4 pb-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">75%</span>
                      </div>
                      <div className="relative h-2 w-full rounded-full overflow-hidden bg-muted">
                        <motion.div
                          className="absolute h-full bg-primary"
                          initial={{ width: 0 }}
                          animate={{ width: "75%" }}
                          transition={{ duration: 0.5, delay: 0.2 }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Tasks</span>
                        <span className="font-medium">15/20 completed</span>
                      </div>
                    </div>
                  </div>

                  {/* Team Section */}
                  <div className="relative px-4 pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="flex -space-x-1.5">
                          {[1, 2, 3].map((i) => (
                            <div
                              key={i}
                              className="h-6 w-6 rounded-full bg-muted border-2 border-background"
                            />
                          ))}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          +3 more
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                          <Clock className="h-3 w-3 text-primary" />
                        </div>
                        <span className="text-xs text-muted-foreground">
                          2 days left
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="bg-background/50 backdrop-blur-sm hover:bg-background/80"
                    >
                      View Details
                      <ChevronRight className="ml-2 h-3 w-3" />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* All Projects Section */}
      {otherProjects && otherProjects.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center space-x-2">
            <FolderKanban className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-xl font-semibold">All Projects</h2>
            <Badge variant="outline" className="ml-2">
              {otherProjects.length}
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherProjects.map((project: Project, index: number) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card
                  className="group relative overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer hover:border-primary/50"
                  onClick={() => handleProjectClick(project.id)}
                >
                  {/* Background Pattern */}
                  <div className="absolute inset-0 bg-gradient-to-br from-muted/5 to-muted/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Top Section */}
                  <div className="relative p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <div className="h-8 w-8 rounded-lg bg-muted/10 flex items-center justify-center">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-base">
                              {project.name}
                            </h3>
                            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              <span>
                                Created{" "}
                                {new Date(
                                  project.createdAt
                                ).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className="text-xs bg-background/50 backdrop-blur-sm"
                      >
                        {project.status.toLowerCase()}
                      </Badge>
                    </div>
                  </div>

                  {/* Progress Section */}
                  <div className="relative px-4 pb-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">60%</span>
                      </div>
                      <div className="relative h-2 w-full rounded-full overflow-hidden bg-muted">
                        <motion.div
                          className="absolute h-full bg-muted-foreground"
                          initial={{ width: 0 }}
                          animate={{ width: "60%" }}
                          transition={{ duration: 0.5, delay: 0.2 }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Tasks</span>
                        <span className="font-medium">12/20 completed</span>
                      </div>
                    </div>
                  </div>

                  {/* Team Section */}
                  <div className="relative px-4 pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="flex -space-x-1.5">
                          {[1, 2].map((i) => (
                            <div
                              key={i}
                              className="h-6 w-6 rounded-full bg-muted border-2 border-background"
                            />
                          ))}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          +2 more
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="h-6 w-6 rounded-full bg-muted/10 flex items-center justify-center">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                        </div>
                        <span className="text-xs text-muted-foreground">
                          5 days left
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="bg-background/50 backdrop-blur-sm hover:bg-background/80"
                    >
                      View Details
                      <ChevronRight className="ml-2 h-3 w-3" />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredProjects?.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center justify-center py-12 text-center"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/20 rounded-full blur-xl" />
            <div className="relative rounded-full bg-primary/10 p-4 mb-4">
              <FileText className="h-10 w-10 text-primary" />
            </div>
          </div>
          <h3 className="text-lg font-medium mb-2">No projects found</h3>
          <p className="text-sm text-muted-foreground mb-4 max-w-sm">
            {searchQuery
              ? "No matching projects found. Try adjusting your search criteria."
              : "Create your first project to start organizing your work."}
          </p>
          <Button
            onClick={() => setShowCreateProject(true)}
            size="sm"
            className="bg-primary hover:bg-primary/90"
          >
            <Plus className="mr-2 h-3 w-3" />
            Create Project
          </Button>
        </motion.div>
      )}

      <CreateProjectDialog
        open={showCreateProject}
        onOpenChange={setShowCreateProject}
      />
    </div>
  );
}
