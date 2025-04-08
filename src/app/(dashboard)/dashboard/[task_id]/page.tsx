"use client";

import { TaskDetails } from "@/app/(dashboard)/dashboard/[task_id]/components/TaskDetails";
import { TaskActivity } from "@/app/(dashboard)/dashboard/[task_id]/components/TaskActivity";
import { Skeleton } from "@/components/ui";
import TaskHeader from "@/app/(dashboard)/dashboard/[task_id]/components/TaskHeader";

import { mockTask } from "./types";
function TaskSkeleton() {
  return (
    <div className="flex h-[calc(100vh-65px)]">
      <div className="flex-1 border-r border-border/50">
        <div className="h-[72px] border-b border-border/50 px-4 flex items-center">
          <div className="w-[70%]">
            <Skeleton className="h-5 w-[60%] mb-2" />
            <Skeleton className="h-4 w-[30%]" />
          </div>
        </div>
        <div className="p-4 space-y-4">
          <Skeleton className="h-32 w-full rounded-lg" />
          <div className="grid grid-cols-3 gap-3">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-[72px] rounded-lg" />
            ))}
          </div>
          <Skeleton className="h-40 w-full rounded-lg" />
          <Skeleton className="h-24 w-full rounded-lg" />
        </div>
      </div>
      <div className="w-[480px]">
        <Skeleton className="h-[72px] border-b border-border/50" />
        <div className="p-4 space-y-4">
          <Skeleton className="h-20 w-full rounded-lg" />
          <Skeleton className="h-20 w-full rounded-lg" />
          <Skeleton className="h-20 w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}

function TaskNotFound() {
  return (
    <div className="flex h-[calc(100vh-65px)] items-center justify-center">
      <div className="text-center space-y-2">
        <h2 className="text-lg font-semibold">Task Not Found</h2>
        <p className="text-sm text-muted-foreground">
          The task you&apos;re looking for doesn&apos;t exist or has been
          deleted.
        </p>
        <a
          href="/dashboard"
          className="inline-block mt-4 text-sm text-primary hover:underline"
        >
          Return to Dashboard
        </a>
      </div>
    </div>
  );
}

export default function TaskPage() {
  const isLoading = false;
  const task = mockTask;

  if (isLoading) {
    return <TaskSkeleton />;
  }

  if (!task) {
    return <TaskNotFound />;
  }

  return (
    <div className="flex flex-col h-[calc(100vh-65px)] bg-background/50 backdrop-blur-xl">
      <TaskHeader task={task} />
      <div className="flex flex-1 min-h-0">
        <TaskDetails task={task} />
        <div className="w-[480px] border-l">
          <TaskActivity activities={task.activities} comments={task.comments} />
        </div>
      </div>
    </div>
  );
}
