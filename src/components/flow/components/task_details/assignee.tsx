"use client";

import { UserPlus, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tooltip } from "@/components/ui/tooltip/tooltip";

interface TaskAssigneeProps {
  assignees: {
    id: string;
    user: {
      id: string;
      name: string;
      image?: string | null;
      email?: string | null;
    } | null;
  }[];
}

export default function TaskAssignee({ assignees }: TaskAssigneeProps) {
  function getInitials(name: string | null | undefined) {
    if (!name) return "U";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }

  return (
    <div className="flex items-center gap-2">
      {assignees.length > 0 && (
        <Tooltip
          content={
            <div className="flex flex-col gap-2 min-w-[200px]">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span className="font-medium">Assignees</span>
              </div>
              <div className="flex flex-col gap-1.5">
                {assignees.map((assignee) => (
                  <div key={assignee.id} className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs">
                      {getInitials(assignee.user?.name)}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">
                        {assignee.user?.name || "Unknown User"}
                      </span>
                      {assignee.user?.email && (
                        <span className="text-xs text-muted-foreground">
                          {assignee.user.email}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          }
          variant="dark"
          side="top"
          delayDuration={500}
        >
          <div className="flex -space-x-2">
            {assignees.map((assignee) => (
              <Avatar
                key={assignee.id}
                className="h-8 w-8 border-2 border-background"
              >
                <AvatarImage src={assignee.user?.image || ""} />
                <AvatarFallback>
                  {getInitials(assignee.user?.name)}
                </AvatarFallback>
              </Avatar>
            ))}
          </div>
        </Tooltip>
      )}

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <UserPlus className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Add Assignee</h4>
              <p className="text-sm text-muted-foreground">
                Search for users to assign to this task
              </p>
            </div>
            {/* TODO: Add user search and selection */}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
