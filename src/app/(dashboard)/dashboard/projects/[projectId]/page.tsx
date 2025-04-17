"use client";

import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/";
import { useRouter, useParams } from "next/navigation";
import { CreateTaskFlowDialog } from "@/components/dashboard/CreateTaskFlowDialog";
import { useState } from "react";
import type { TaskFlow } from "@prisma/client";

export default function ProjectPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.projectId as string;
  const [showCreateTaskFlow, setShowCreateTaskFlow] = useState(false);

  const { data: project, isLoading } = useQuery({
    queryKey: ["project", projectId],
    queryFn: async () => {
      const response = await fetch(`/api/projects/${projectId}`);
      if (!response.ok) throw new Error("Failed to fetch project");
      return response.json();
    },
  });

  const { data: taskFlows } = useQuery({
    queryKey: ["taskflows", projectId],
    queryFn: async () => {
      const response = await fetch(`/api/projects/${projectId}/taskflows`);
      if (!response.ok) throw new Error("Failed to fetch taskflows");
      return response.json();
    },
    enabled: !!project,
  });

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-gray-500">Project not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center space-x-4 mb-8">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
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
            onClick={() => router.push(`/dashboard/taskflows/${taskFlow.id}`)}
          >
            <CardHeader>
              <CardTitle>{taskFlow.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-gray-500">
                  Created: {new Date(taskFlow.createdAt).toLocaleDateString()}
                </p>
              </div>
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
