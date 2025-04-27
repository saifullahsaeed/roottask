import { Pin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { DiscussionHeaderProps } from "./types";

export const DiscussionHeader = ({
  userName,
  createdAt,
  isPinned,
  isReply,
}: DiscussionHeaderProps) => (
  <div className="flex items-center gap-2 mb-1">
    <span className="text-xs font-medium">{userName}</span>
    <span className="text-[11px] text-muted-foreground">
      {new Date(createdAt).toLocaleDateString()}
    </span>
    {isPinned && !isReply && (
      <div className="flex items-center gap-1.5">
        <Badge
          variant="secondary"
          className="h-4 bg-primary/10 text-primary text-[11px] flex items-center"
        >
          <Pin className="h-2 w-2 mr-1" /> Pinned
        </Badge>
        <div className="h-3 w-px bg-muted/50" />
      </div>
    )}
  </div>
);
