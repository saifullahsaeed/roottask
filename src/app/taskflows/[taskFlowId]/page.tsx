"use client";

import { TaskFlow } from "@/components/flow/TaskFlow";
import { ArrowLeft, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

async function getTaskFlow(taskFlowId: string) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const response = await fetch(`${baseUrl}/api/taskflows/${taskFlowId}`, {
    cache: "no-store",
  });
  if (!response.ok) throw new Error("Failed to fetch taskflow");
  return response.json();
}

export default function TaskFlowPage() {
  const params = useParams();
  const taskFlowId = params.taskFlowId as string;

  const { data: taskFlow, isLoading } = useQuery({
    queryKey: ["taskflow", taskFlowId],
    queryFn: () => getTaskFlow(taskFlowId),
  });

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!taskFlow) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-gray-500">Taskflow not found</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between px-4 py-2.5 border-b bg-muted/50">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            className="h-7 px-2 bg-background hover:bg-background/90 border-border/80 shadow-sm"
            asChild
          >
            <Link
              href={`/dashboard/projects/${taskFlow.projectId}`}
              className="flex items-center gap-1"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span className="text-[10px] font-medium">Project</span>
            </Link>
          </Button>
          <div className="h-4 w-px bg-border" />
          <h1 className="text-sm font-medium">{taskFlow.name}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 hover:bg-background"
          >
            <MoreVertical className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
      <div className="flex-1">
        <TaskFlow taskFlowId={taskFlowId} />
      </div>
    </div>
  );
}
