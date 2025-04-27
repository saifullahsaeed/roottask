import { cn } from "@/lib/utils";
import AvatarInitials from "@/components/ui/avatar_intitals/AvatarInitials";
import type { AssigneeWithUser } from "@/types";
import { Tooltip } from "@/components/ui/tooltip/tooltip";

interface AssigneesProps {
  assignees: AssigneeWithUser[];
}

export function Assignees({ assignees }: AssigneesProps) {
  return (
    <div className="flex items-center">
      {assignees.slice(0, 3).map((assignee, index) => (
        <Tooltip
          key={index}
          content={
            <div className="text-xs">
              <div className="font-medium text-primary mb-1">
                {assignee.user.name || "No Name"}
              </div>
              <div className="text-muted-foreground">
                {assignee.user.email || "No email"}
              </div>
            </div>
          }
          variant="dark"
          size="sm"
        >
          <div
            className={cn(
              "group relative",
              index !== 0 && "-ml-2",
              "hover:z-10 transition-transform duration-200 hover:scale-110"
            )}
          >
            <AvatarInitials
              name={assignee.user.name || "No Name"}
              className="transition-all duration-200 group-hover:ring-2 group-hover:ring-primary/50"
            />
          </div>
        </Tooltip>
      ))}
      {assignees.length > 3 && (
        <Tooltip
          content={
            <div className="text-xs">
              <div className="font-medium text-primary mb-1">
                {assignees.length - 3} more assignees
              </div>
              <div className="text-muted-foreground space-y-1">
                {assignees.slice(3).map((assignee, index) => (
                  <div key={index}>{assignee.user.name || "No Name"}</div>
                ))}
              </div>
            </div>
          }
          variant="dark"
          size="sm"
        >
          <div className="w-8 h-8 rounded-full border-2 border-background bg-primary/10 -ml-2 flex items-center justify-center group hover:bg-primary/20 transition-colors duration-200">
            <span className="text-xs font-medium text-primary group-hover:scale-110 transition-transform duration-200">
              +{assignees.length - 3}
            </span>
          </div>
        </Tooltip>
      )}
    </div>
  );
}
