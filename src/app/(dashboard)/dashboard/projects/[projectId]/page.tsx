"use client";

import { useState } from "react";
import { Button } from "@/components/ui";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Plus, Settings, List, BarChart2 } from "lucide-react";
import WorkflowTable from "./components/WorkflowTable";
import WorkflowTimeline from "./components/WorkflowTimeline";
import { CreateTaskFlowDialog } from "@/components/dashboard/CreateTaskFlowDialog";
import { useRouter, useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

export default function ProjectWorkflowsPage() {
  const [tab, setTab] = useState("list");
  const [showCreateTaskFlow, setShowCreateTaskFlow] = useState(false);
  const router = useRouter();
  const params = useParams();
  const projectId = params.projectId as string;
  // Dummy project info
  const {
    data: project,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => getProject(projectId),
  });

  function getProject(projectId: string) {
    return fetch(`/api/projects/${projectId}`).then((res) => res.json());
  }

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="w-full">
      <div className="w-full px-4 pt-8">
        {/* Header */}
        <div className="flex items-center justify-between gap-2 py-2 mb-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="min-w-0">
              <h1 className="text-base font-semibold tracking-tight text-white truncate leading-tight">
                {project.name}
              </h1>
              <span
                className={
                  "inline-block ml-1 px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wide border bg-primary/10 text-primary border-primary/20"
                }
              >
                {project.status.replace("_", " ")}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-zinc-400 hover:text-primary"
            >
              <Settings className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              className="flex items-center h-8 px-4 bg-primary hover:bg-primary/90 text-white font-semibold transition-transform hover:-translate-y-0.5"
              onClick={() => setShowCreateTaskFlow(true)}
            >
              <Plus className="mr-1 h-4 w-4" />
              New Workflow
            </Button>
          </div>
        </div>
        {/* Create TaskFlow Dialog */}
        <CreateTaskFlowDialog
          open={showCreateTaskFlow}
          onOpenChange={setShowCreateTaskFlow}
          projectId={projectId}
          onCreated={(taskFlowId: string) => {
            setShowCreateTaskFlow(false);
            router.push(`/taskflows/${taskFlowId}`);
          }}
        />
        {/* Tabs */}
        <Tabs value={tab} onValueChange={setTab}>
          <div className="flex items-center border-b border-zinc-800 px-2 pt-0 pb-0">
            <TabsList className="flex gap-1 items-center bg-transparent border-0 shadow-none px-0 py-0 min-w-0">
              <TabsTrigger
                value="list"
                className="relative flex items-center px-3 py-2 text-sm font-medium transition-colors
                  data-[state=active]:text-primary data-[state=active]:font-bold
                  data-[state=inactive]:text-zinc-400
                  hover:text-primary focus:outline-none"
                style={{ border: "none", background: "none" }}
              >
                <List className="h-4 w-4 mr-1 inline-block align-middle" />
                List View
                <span className="absolute left-0 -bottom-0.5 w-full h-0.5 bg-primary rounded transition-all duration-300 scale-x-0 data-[state=active]:scale-x-100 origin-left" />
              </TabsTrigger>
              <TabsTrigger
                value="timeline"
                className="relative flex items-center px-3 py-2 text-sm font-medium transition-colors
                  data-[state=active]:text-primary data-[state=active]:font-bold
                  data-[state=inactive]:text-zinc-400
                  hover:text-primary focus:outline-none"
                style={{ border: "none", background: "none" }}
              >
                <BarChart2 className="h-4 w-4 mr-1 inline-block align-middle" />
                Timeline View
                <span className="absolute left-0 -bottom-0.5 w-full h-0.5 bg-primary rounded transition-all duration-300 scale-x-0 data-[state=active]:scale-x-100 origin-left" />
              </TabsTrigger>
            </TabsList>
          </div>
          {/* List View */}
          <TabsContent value="list">
            <WorkflowTable />
          </TabsContent>
          {/* Timeline View */}
          <TabsContent value="timeline">
            <div className="w-full px-2 py-6">
              <WorkflowTimeline />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
