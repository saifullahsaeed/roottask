import { Button } from "@/components/ui/button/Button";
import {
  ChevronLeft,
  Edit2,
  Copy,
  Repeat,
  MoreHorizontal,
  Users,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Tooltip } from "@/components/ui/tooltip/tooltip";
import { Task } from "@/types";
import AvatarInitials from "@/components/ui/avatar_intitals/AvatarInitials";

interface TaskHeaderProps {
  task: Task;
}

function TaskHeader({ task }: TaskHeaderProps) {
  return (
    <div className="h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
      <div className="px-6 h-full flex items-center gap-4">
        <Link href="/dashboard">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 hover:bg-muted/50 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-semibold truncate">{task.title}</h1>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 hover:bg-muted/50 transition-colors"
            >
              <Edit2 className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex items-center gap-3 mt-0.5">
            <div className="flex items-center gap-1.5">
              <Copy className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground font-medium">
                {task.id}
              </span>
            </div>
            {task.isRecurring && (
              <div className="flex items-center gap-1.5 text-sm text-primary font-medium">
                <Repeat className="w-3.5 h-3.5" />
                <span>Recurring</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Status Button */}
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              className="h-9 px-3 gap-2.5 min-w-[140px] group hover:border-primary/30 hover:bg-primary/5 transition-all"
            >
              <div className="flex items-center gap-2 flex-1">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-primary ring-4 ring-primary/10" />
                  <span className="font-medium">{task.status?.name}</span>
                </div>
                <ChevronLeft className="w-4 h-4 rotate-[-90deg] text-muted-foreground ml-auto transition-transform group-hover:translate-y-0.5" />
              </div>
            </Button>
            <div className="absolute inset-0 rounded-md bg-gradient-to-r from-primary/10 via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </div>

          {/* Assignees */}
          <div className="flex items-center gap-2">
            {task.assignments && task.assignments.length > 0 ? (
              <Tooltip
                content={
                  <div className="flex flex-col gap-2 min-w-[200px]">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span className="font-medium">Assignees</span>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      {task.assignments.map((assignment) => (
                        <div
                          key={assignment.id}
                          className="flex items-center gap-2"
                        >
                          <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs">
                            {assignment.teamMember.user.name?.charAt(0) || "?"}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">
                              {assignment.teamMember.user.name}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {assignment.teamMember.user.email}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                }
                variant="dark"
                side="bottom"
                delayDuration={500}
              >
                <div className="flex -space-x-2 mr-1">
                  {task.assignments.slice(0, 3).map((assignment) => (
                    <AvatarInitials
                      key={assignment.id}
                      name={assignment.teamMember.user.name || ""}
                    />
                  ))}
                  {task.assignments.length > 3 && (
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium ring-2 ring-background hover:bg-muted/80 transition-colors cursor-pointer">
                      +{task.assignments.length - 3}
                    </div>
                  )}
                </div>
              </Tooltip>
            ) : null}
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "h-9 gap-2 group relative overflow-hidden transition-all",
                "hover:border-primary/30 hover:bg-primary/5",
                !task.assignments?.length && "pl-2.5 pr-3.5",
                task.assignments?.length && "px-3"
              )}
            >
              {!task.assignments?.length && (
                <div className="w-8 h-8 rounded-full border-2 border-dashed border-muted-foreground/20 flex items-center justify-center group-hover:border-primary/20 transition-colors">
                  <Users className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              )}
              <span
                className={cn(
                  "font-medium text-muted-foreground group-hover:text-primary transition-colors",
                  !task.assignments?.length && "sr-only"
                )}
              >
                Assign
              </span>
              <Plus
                className={cn(
                  "w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors",
                  !task.assignments?.length && "hidden"
                )}
              />
              {/* Subtle gradient effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/2 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </Button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 hover:bg-muted/50 transition-colors"
          >
            <MoreHorizontal className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default TaskHeader;
