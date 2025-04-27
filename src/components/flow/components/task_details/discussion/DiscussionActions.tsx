import { ThumbsUp, Reply, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/";
import { cn } from "@/lib/utils";
import type { DiscussionActionsProps } from "./types";

export const DiscussionActions = ({
  isLiked,
  likesCount,
  onLike,
  onReply,
  hasReplies,
  onToggleReplies,
  isReply,
}: DiscussionActionsProps) => (
  <div className="flex items-center gap-2">
    <Button
      variant="ghost"
      size="sm"
      className={cn(
        "h-6 px-1.5 text-[11px] hover:bg-muted/50",
        isLiked && "text-primary hover:text-primary"
      )}
      onClick={onLike}
    >
      <ThumbsUp className="h-3 w-3 mr-0.5" />
      {likesCount} Likes
    </Button>
    {!isReply && (
      <>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 px-1.5 text-[11px] text-muted-foreground hover:text-foreground hover:bg-muted/50"
          onClick={onReply}
        >
          <Reply className="h-3 w-3 mr-0.5" />
          Reply
        </Button>
        {hasReplies && (
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-1.5 text-[11px] text-muted-foreground hover:text-foreground hover:bg-muted/50"
            onClick={onToggleReplies}
          >
            <ChevronDown className="h-3 w-3 mr-0.5" />
            {hasReplies} Replies
          </Button>
        )}
      </>
    )}
  </div>
);
