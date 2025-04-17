import { cn } from "@/lib/utils";
import AvatarInitials from "@/components/ui/avatar_intitals/AvatarInitials";
import type { User } from "@prisma/client";

interface AssigneesProps {
  assignees: User[];
}

export function Assignees({ assignees }: AssigneesProps) {
  return (
    <div className="flex items-center">
      {assignees.slice(0, 3).map((assignee, index) => (
        <div key={index} className={cn(index !== 0 && "-ml-2")}>
          <AvatarInitials name={assignee.name || "No Name"} />
        </div>
      ))}
      {assignees.length > 3 && (
        <div className="w-8 h-8 rounded-full border-2 border-background bg-primary/10 -ml-2 flex items-center justify-center">
          <span className="text-xs font-medium text-primary">
            +{assignees.length - 3}
          </span>
        </div>
      )}
    </div>
  );
}
