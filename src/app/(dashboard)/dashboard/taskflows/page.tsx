"use client";

import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Plus, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/";
import { useRouter } from "next/navigation";
import { CreateTaskFlowDialog } from "@/components/dashboard/CreateTaskFlowDialog";
import type { TaskFlow } from "@prisma/client";
import { useState } from "react";

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
      <div className="flex h-full items-center justify-center">
        <p className="text-gray-500">No project selected</p>
      </div>
    );
  }

  if (isProjectLoading || isTaskFlowsLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const handleTaskFlowClick = (taskFlowId: string) => {
    router.push(`/dashboard/taskflows/${taskFlowId}`);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center space-x-4 mb-8">
        <Button
          variant="ghost"
          onClick={() => router.push("/dashboard")}
          className="flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Projects
        </Button>
        <h1 className="text-3xl font-bold">{project.name}</h1>
      </div>

      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-semibold">Taskflows</h2>
        <Button onClick={() => setShowCreateTaskFlow(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Taskflow
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {taskFlows?.map((taskFlow: TaskFlow) => (
          <Card
            key={taskFlow.id}
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => handleTaskFlowClick(taskFlow.id)}
          >
            <CardHeader>
              <CardTitle>{taskFlow.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                Created: {new Date(taskFlow.createdAt).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <CreateTaskFlowDialog
        open={showCreateTaskFlow}
        onOpenChange={setShowCreateTaskFlow}
        projectId={projectId}
      />
    </div>
  );
}
