"use client";

import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Plus, ArrowLeft, Clock, FileText } from "lucide-react";
import { Button } from "@/components/ui/";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/";
import { useRouter } from "next/navigation";
import { CreateTaskFlowDialog } from "@/components/dashboard/CreateTaskFlowDialog";
import type { TaskFlow } from "@prisma/client";
import { useState } from "react";
import { Skeleton } from "@/components/ui/";

export default function TaskFlowsPage() {
  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId");
  const router = useRouter();
  const [showCreateTaskFlow, setShowCreateTaskFlow] = useState(false);

  // Fetch project details
  const { data: project, isLoading: isProjectLoading } = useQuery({
    queryKey: ["project", projectId],
    queryFn: async () => {
      const response = await fetch(`/api/projects/${projectId}`);
      if (!response.ok) throw new Error("Failed to fetch project");
      return response.json();
    },
    enabled: !!projectId,
  });

  // Fetch taskflows separately
  const { data: taskFlows, isLoading: isTaskFlowsLoading } = useQuery({
    queryKey: ["taskflows", projectId],
    queryFn: async () => {
      const response = await fetch(`/api/projects/${projectId}/taskflows`);
      if (!response.ok) throw new Error("Failed to fetch taskflows");
      return response.json();
    },
    enabled: !!projectId,
  });

  if (!projectId) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-center space-y-4">
          <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
          <p className="text-lg text-muted-foreground">No project selected</p>
          <Button onClick={() => router.push("/dashboard")} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Button>
        </div>
      </div>
    );
  }

  if (isProjectLoading || isTaskFlowsLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-10 w-40" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const handleTaskFlowClick = (taskFlowId: string) => {
    router.push(`/taskflows/${taskFlowId}`);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => router.push("/dashboard")}
              className="flex items-center"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Projects
            </Button>
            <div className="space-y-1">
              <h1 className="text-3xl font-bold tracking-tight">
                {project.name}
              </h1>
              <p className="text-sm text-muted-foreground">
                Manage your taskflows
              </p>
            </div>
          </div>
          <Button
            onClick={() => setShowCreateTaskFlow(true)}
            className="flex items-center"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Taskflow
          </Button>
        </div>

        {/* Taskflows Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {taskFlows?.map((taskFlow: TaskFlow) => (
            <Card
              key={taskFlow.id}
              className="group hover:shadow-lg transition-all duration-200 cursor-pointer hover:border-primary/50"
              onClick={() => handleTaskFlowClick(taskFlow.id)}
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{taskFlow.name}</span>
                  <FileText className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </CardTitle>
                <CardDescription>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="mr-2 h-4 w-4" />
                    Created {new Date(taskFlow.createdAt).toLocaleDateString()}
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    Click to view details
                  </span>
                  <span className="text-primary font-medium">View →</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {taskFlows?.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No taskflows yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Create your first taskflow to get started
            </p>
            <Button onClick={() => setShowCreateTaskFlow(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Taskflow
            </Button>
          </div>
        )}
      </div>

      <CreateTaskFlowDialog
        open={showCreateTaskFlow}
        onOpenChange={setShowCreateTaskFlow}
        projectId={projectId}
      />
    </div>
  );
}
