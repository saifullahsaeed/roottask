"use client";

import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Plus,
  Clock,
  FileText,
  ChevronRight,
  Search,
  LayoutGrid,
  List,
  Filter,
  Calendar,
  Settings,
  TrendingUp,
  Users,
  Activity,
  BarChart2,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/";
import { useRouter, useParams } from "next/navigation";
import { CreateTaskFlowDialog } from "@/components/dashboard/CreateTaskFlowDialog";
import { useState } from "react";
import { TaskFlow } from "@prisma/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

export default function ProjectPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.projectId as string;
  const [showCreateTaskFlow, setShowCreateTaskFlow] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeTab, setActiveTab] = useState("overview");

  const { data: project, isLoading: isProjectLoading } = useQuery({
    queryKey: ["project", projectId],
    queryFn: async () => {
      const response = await fetch(`/api/projects/${projectId}`);
      if (!response.ok) throw new Error("Failed to fetch project");
      return response.json();
    },
  });

  const { data: taskFlows, isLoading: isTaskFlowsLoading } = useQuery({
    queryKey: ["taskflows", projectId],
    queryFn: async () => {
      const response = await fetch(`/api/projects/${projectId}/taskflows`);
      if (!response.ok) throw new Error("Failed to fetch taskflows");
      return response.json();
    },
    enabled: !!project,
  });

  const filteredTaskFlows = taskFlows?.filter((tf: TaskFlow) => {
    return tf.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  if (isProjectLoading || isTaskFlowsLoading) {
    return (
      <div className="container mx-auto py-4 px-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-8 w-32" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader className="p-4">
                  <Skeleton className="h-5 w-3/4" />
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-center space-y-3">
          <FileText className="h-10 w-10 mx-auto text-muted-foreground" />
          <p className="text-base text-muted-foreground">Project not found</p>
          <Button
            onClick={() => router.push("/dashboard")}
            variant="outline"
            size="sm"
          >
            <ArrowLeft className="mr-2 h-3 w-3" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-4 px-4">
      {/* Header Section */}
      <div className="space-y-6 mb-8">
        {/* Top Navigation */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/dashboard")}
              className="flex items-center hover:bg-muted/50"
            >
              <ArrowLeft className="mr-2 h-3 w-3" />
              Back to Dashboard
            </Button>
            <div className="h-4 w-px bg-border" />
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-semibold">{project.name}</h1>
              <Badge variant="outline" className="text-xs">
                Active
              </Badge>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="hover:bg-muted/50">
              <Settings className="h-4 w-4" />
            </Button>
            <Button
              onClick={() => setShowCreateTaskFlow(true)}
              size="sm"
              className="flex items-center bg-primary hover:bg-primary/90"
            >
              <Plus className="mr-2 h-3 w-3" />
              Create Taskflow
            </Button>
          </div>
        </div>

        {/* Project Stats */}
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
                      Project Health
                    </p>
                    <div className="flex items-center space-x-2">
                      <p className="text-2xl font-bold">85%</p>
                      <Badge variant="default" className="text-xs">
                        On Track
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="h-3 w-3 text-green-500" />
                      <p className="text-xs text-muted-foreground">
                        +5% from last week
                      </p>
                    </div>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Activity className="h-5 w-5 text-primary" />
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
                      Upcoming Deadlines
                    </p>
                    <div className="flex items-center space-x-2">
                      <p className="text-2xl font-bold">3</p>
                      <Badge variant="secondary" className="text-xs">
                        This Week
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3 text-blue-500" />
                      <p className="text-xs text-muted-foreground">
                        2 high priority
                      </p>
                    </div>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-blue-500" />
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
            <Card className="bg-gradient-to-br from-orange-500/5 to-orange-500/10 border-0 hover:shadow-lg transition-all duration-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Blocked Tasks
                    </p>
                    <div className="flex items-center space-x-2">
                      <p className="text-2xl font-bold">5</p>
                      <Badge variant="destructive" className="text-xs">
                        Needs Attention
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-1">
                      <AlertCircle className="h-3 w-3 text-orange-500" />
                      <p className="text-xs text-muted-foreground">
                        2 waiting for review
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

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <Card className="bg-gradient-to-br from-purple-500/5 to-purple-500/10 border-0 hover:shadow-lg transition-all duration-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Team Activity
                    </p>
                    <div className="flex items-center space-x-2">
                      <p className="text-2xl font-bold">24</p>
                      <Badge variant="outline" className="text-xs">
                        Today
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-3 w-3 text-purple-500" />
                      <p className="text-xs text-muted-foreground">
                        8 active members
                      </p>
                    </div>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                    <Users className="h-5 w-5 text-purple-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <TabsList className="bg-muted/50">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              <Activity className="mr-2 h-3 w-3" />
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="taskflows"
              className="data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              <FileText className="mr-2 h-3 w-3" />
              Taskflows
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              <BarChart2 className="mr-2 h-3 w-3" />
              Analytics
            </TabsTrigger>
            <TabsTrigger
              value="team"
              className="data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              <Users className="mr-2 h-3 w-3" />
              Team
            </TabsTrigger>
          </TabsList>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search workflows..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 w-[300px] bg-muted/50 border-0 focus-visible:ring-1"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              className="bg-muted/50 border-0"
            >
              <Filter className="mr-2 h-3 w-3" />
              Filter
            </Button>
            <div className="flex items-center space-x-1">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="bg-muted/50 border-0"
              >
                <LayoutGrid className="h-3 w-3" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="bg-muted/50 border-0"
              >
                <List className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="mr-2 h-4 w-4" />
                  Project Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  Timeline visualization coming soon
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.1 }}
                      className="flex items-start space-x-3"
                    >
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <FileText className="h-4 w-4 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Task completed</p>
                        <p className="text-xs text-muted-foreground">
                          2 hours ago
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="taskflows" className="space-y-4">
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredTaskFlows?.map((taskFlow: TaskFlow, index: number) => (
                <motion.div
                  key={taskFlow.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card
                    className="group relative overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer hover:border-primary/50"
                    onClick={() => router.push(`/taskflows/${taskFlow.id}`)}
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
                                {taskFlow.name}
                              </h3>
                              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                                <Calendar className="h-3 w-3" />
                                <span>Mar 15 - Apr 2, 2024</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <Badge
                          variant="outline"
                          className="text-xs bg-background/50 backdrop-blur-sm"
                        >
                          Active
                        </Badge>
                      </div>
                    </div>

                    {/* Progress Section */}
                    <div className="relative px-4 pb-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">
                            Progress
                          </span>
                          <span className="font-medium">66%</span>
                        </div>
                        <div className="relative h-2 w-full rounded-full overflow-hidden bg-muted">
                          <motion.div
                            className="absolute h-full bg-primary"
                            initial={{ width: 0 }}
                            animate={{ width: "66%" }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Tasks</span>
                          <span className="font-medium">12/18 completed</span>
                        </div>
                      </div>
                    </div>

                    {/* Team Section */}
                    <div className="relative px-4 pb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="flex -space-x-1.5">
                            {[1, 2, 3].map((i) => (
                              <Avatar
                                key={i}
                                className="h-6 w-6 border-2 border-background"
                              >
                                <AvatarImage src={`/avatars/0${i}.png`} />
                                <AvatarFallback>U</AvatarFallback>
                              </Avatar>
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
          ) : (
            <ScrollArea className="h-[calc(100vh-300px)]">
              <div className="space-y-2">
                {filteredTaskFlows?.map((taskFlow: TaskFlow, index: number) => (
                  <motion.div
                    key={taskFlow.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card
                      className="group relative overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer hover:border-primary/50"
                      onClick={() => router.push(`/taskflows/${taskFlow.id}`)}
                    >
                      {/* Background Pattern */}
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                              <FileText className="h-5 w-5 text-primary" />
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center space-x-2">
                                <h3 className="font-medium">{taskFlow.name}</h3>
                                <Badge
                                  variant="outline"
                                  className="text-xs bg-background/50 backdrop-blur-sm"
                                >
                                  Active
                                </Badge>
                              </div>
                              <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                                <div className="flex items-center space-x-1">
                                  <Calendar className="h-3 w-3" />
                                  <span>Mar 15 - Apr 2, 2024</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Clock className="h-3 w-3" />
                                  <span>2 days left</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-6">
                            <div className="text-right">
                              <div className="flex items-center space-x-2">
                                <span className="text-sm font-medium">
                                  12/18 tasks
                                </span>
                                <div className="h-2 w-20 rounded-full overflow-hidden bg-muted">
                                  <motion.div
                                    className="h-full bg-primary"
                                    initial={{ width: 0 }}
                                    animate={{ width: "66%" }}
                                    transition={{ duration: 0.5, delay: 0.2 }}
                                  />
                                </div>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                66% complete
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="flex -space-x-1.5">
                                {[1, 2, 3].map((i) => (
                                  <Avatar
                                    key={i}
                                    className="h-6 w-6 border-2 border-background"
                                  >
                                    <AvatarImage src={`/avatars/0${i}.png`} />
                                    <AvatarFallback>U</AvatarFallback>
                                  </Avatar>
                                ))}
                              </div>
                              <span className="text-xs text-muted-foreground">
                                +3 more
                              </span>
                            </div>
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <ChevronRight className="h-4 w-4 text-primary" />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          )}

          {/* Empty State */}
          {filteredTaskFlows?.length === 0 && (
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
              <h3 className="text-lg font-medium mb-2">No taskflows found</h3>
              <p className="text-sm text-muted-foreground mb-4 max-w-sm">
                {searchQuery
                  ? "No matching taskflows found. Try adjusting your search criteria."
                  : "Create your first taskflow to start organizing your project's workflow."}
              </p>
              <Button
                onClick={() => setShowCreateTaskFlow(true)}
                size="sm"
                className="bg-primary hover:bg-primary/90"
              >
                <Plus className="mr-2 h-3 w-3" />
                Create Taskflow
              </Button>
            </motion.div>
          )}
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart2 className="mr-2 h-4 w-4" />
                Project Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                Analytics dashboard coming soon
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-4 w-4" />
                Team Members
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                Team management coming soon
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <CreateTaskFlowDialog
        open={showCreateTaskFlow}
        onOpenChange={setShowCreateTaskFlow}
        projectId={projectId}
      />
    </div>
  );
}
