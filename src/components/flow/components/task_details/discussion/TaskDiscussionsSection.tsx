import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import {
  Send,
  Pin,
  Paperclip,
  AtSign,
  X,
  MessageSquare,
  Reply,
} from "lucide-react";
import { Button } from "@/components/ui/";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { TaskCommentWithRelations } from "@/types";
import type { DiscussionWithUI } from "./types";
import { DiscussionHeader } from "./DiscussionHeader";
import { DiscussionActions } from "./DiscussionActions";
import { DiscussionEdit } from "./DiscussionEdit";
import { DiscussionMenu } from "./DiscussionMenu";
import { AttachmentList } from "./AttachmentList";

export function TaskDiscussionsSection({ taskId }: { taskId: string }) {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");

  // Fetch discussions
  const { data: discussions = [], isLoading } = useQuery({
    queryKey: ["discussions", taskId],
    queryFn: async () => {
      const response = await fetch(`/api/task/${taskId}/discussion`);
      if (!response.ok) throw new Error("Failed to fetch discussions");
      const data = (await response.json()) as TaskCommentWithRelations[];
      return data.map((d) => ({
        ...d,
        showReplies: false,
      })) as DiscussionWithUI[];
    },
  });

  // Separate pinned and unpinned discussions
  const pinnedDiscussions = discussions.filter((d) => d.isPinned);
  const unpinnedDiscussions = discussions.filter((d) => !d.isPinned);

  // Add comment mutation
  const addCommentMutation = useMutation({
    mutationFn: async (data: {
      content: string;
      parentId?: string;
      mentions?: string[];
    }) => {
      const response = await fetch(`/api/task/${taskId}/discussion`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to add comment");
      return response.json() as Promise<TaskCommentWithRelations>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["discussions", taskId] });
      setNewComment("");
      setReplyingTo(null);
      setReplyContent("");
    },
  });

  // Update comment mutation (edit/pin)
  const updateCommentMutation = useMutation({
    mutationFn: async (data: {
      commentId: string;
      content?: string;
      isPinned?: boolean;
    }) => {
      const response = await fetch(`/api/task/${taskId}/discussion`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update comment");
      return response.json() as Promise<TaskCommentWithRelations>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["discussions", taskId] });
    },
  });

  // Delete comment mutation
  const deleteCommentMutation = useMutation({
    mutationFn: async (commentId: string) => {
      const response = await fetch(
        `/api/task/${taskId}/discussion?commentId=${commentId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) throw new Error("Failed to delete comment");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["discussions", taskId] });
    },
  });

  // Like mutation
  const likeMutation = useMutation({
    mutationFn: async (commentId: string) => {
      const response = await fetch(`/api/task/${taskId}/discussion/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commentId }),
      });
      if (!response.ok) throw new Error("Failed to like comment");
      return response.json();
    },
    onSuccess: (data) => {
      // Update the comment in the cache
      queryClient.setQueryData<TaskCommentWithRelations[]>(
        ["discussions", taskId],
        (old) => {
          if (!old) return [];
          return old.map((comment) => {
            if (comment.id === data.id) {
              return {
                ...comment,
                likes: data.likes,
              };
            }
            return comment;
          });
        }
      );
    },
  });

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    addCommentMutation.mutate({ content: newComment });
  };

  const handleAddReply = (discussionId: string) => {
    if (!replyContent.trim()) return;
    addCommentMutation.mutate({
      content: replyContent,
      parentId: discussionId,
    });
  };

  const handleLike = (discussionId: string) => {
    likeMutation.mutate(discussionId);
  };

  const handlePin = (discussionId: string) => {
    const discussion = discussions.find((d) => d.id === discussionId);
    if (discussion) {
      updateCommentMutation.mutate({
        commentId: discussionId,
        isPinned: !discussion.isPinned,
      });
    }
  };

  const handleEdit = (discussionId: string, content: string) => {
    updateCommentMutation.mutate({
      commentId: discussionId,
      content,
    });
  };

  const handleDelete = (discussionId: string) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      deleteCommentMutation.mutate(discussionId);
    }
  };

  const toggleReplies = (discussionId: string) => {
    const updatedDiscussions = discussions.map((discussion) => {
      if (discussion.id === discussionId) {
        return {
          ...discussion,
          showReplies: !discussion.showReplies,
        };
      }
      return discussion;
    });
    queryClient.setQueryData(["discussions", taskId], updatedDiscussions);
  };

  const renderDiscussion = (
    discussion: DiscussionWithUI,
    isReply: boolean = false
  ) => {
    const hasReplies = discussion.replies && discussion.replies.length > 0;
    const isReplying = replyingTo === discussion.id;
    const userName = discussion.user?.name || "Unknown User";
    const userImage = discussion.user?.image || undefined;
    const isLiked = discussion.likes?.some(
      (like) => like.userId === session?.user?.id
    );

    return (
      <div key={discussion.id}>
        <div
          className={cn(
            "group relative transition-all duration-200",
            isReply ? "ml-6" : "",
            discussion.isPinned ? "bg-primary/5 border-l-2 border-primary" : ""
          )}
        >
          <div className="p-2.5">
            <div className="flex gap-3">
              <div className="flex flex-col items-center">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={userImage} />
                  <AvatarFallback>
                    {userName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <DiscussionHeader
                    userName={userName}
                    createdAt={discussion.createdAt}
                    isPinned={discussion.isPinned}
                    isReply={isReply}
                  />
                  {!isReply && (
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                          "h-5 w-5 hover:bg-muted/50",
                          discussion.isPinned && "text-primary"
                        )}
                        onClick={() => handlePin(discussion.id)}
                      >
                        <Pin className="h-3 w-3" />
                      </Button>
                      <DiscussionMenu
                        onEdit={() => {
                          const updatedDiscussions = discussions.map((d) =>
                            d.id === discussion.id
                              ? {
                                  ...d,
                                  isEditing: true,
                                  editContent: d.content,
                                }
                              : d
                          );
                          queryClient.setQueryData(
                            ["discussions", taskId],
                            updatedDiscussions
                          );
                        }}
                        onDelete={() => handleDelete(discussion.id)}
                      />
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  {discussion.isEditing ? (
                    <DiscussionEdit
                      content={discussion.editContent || ""}
                      onSave={(content) => {
                        if (content) {
                          handleEdit(discussion.id, content);
                        }
                        const updatedDiscussions = discussions.map((d) =>
                          d.id === discussion.id
                            ? {
                                ...d,
                                isEditing: false,
                                editContent: undefined,
                              }
                            : d
                        );
                        queryClient.setQueryData(
                          ["discussions", taskId],
                          updatedDiscussions
                        );
                      }}
                      onCancel={() => {
                        const updatedDiscussions = discussions.map((d) =>
                          d.id === discussion.id
                            ? {
                                ...d,
                                isEditing: false,
                                editContent: undefined,
                              }
                            : d
                        );
                        queryClient.setQueryData(
                          ["discussions", taskId],
                          updatedDiscussions
                        );
                      }}
                    />
                  ) : (
                    <p className="text-xs text-foreground/90 whitespace-pre-wrap leading-relaxed">
                      {discussion.content}
                    </p>
                  )}

                  {discussion.attachments &&
                    discussion.attachments.length > 0 && (
                      <AttachmentList attachments={discussion.attachments} />
                    )}

                  <DiscussionActions
                    isLiked={isLiked}
                    likesCount={discussion.likes?.length || 0}
                    onLike={() => handleLike(discussion.id)}
                    onReply={() => setReplyingTo(discussion.id)}
                    hasReplies={hasReplies}
                    onToggleReplies={() => toggleReplies(discussion.id)}
                    isReply={isReply}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Reply Input */}
          {isReplying && (
            <div className="mt-2 ml-8">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Reply className="h-3 w-3" />
                  <span>Replying to {userName}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 hover:bg-muted/50 ml-auto"
                    onClick={() => {
                      setReplyingTo(null);
                      setReplyContent("");
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <Textarea
                      placeholder="Write a reply..."
                      value={replyContent}
                      onChange={(e) => {
                        setReplyContent(e.target.value);
                      }}
                      className="min-h-[60px] resize-none pr-8 bg-background/50 backdrop-blur-sm border-muted/50 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-colors text-sm"
                    />
                    <div className="absolute right-1.5 bottom-1.5 flex items-center gap-0.5">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5 hover:bg-muted/50"
                      >
                        <Paperclip className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5 hover:bg-muted/50"
                      >
                        <AtSign className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <Button
                    size="icon"
                    onClick={() => handleAddReply(discussion.id)}
                    disabled={!replyContent.trim()}
                    className="self-end h-7 w-7 hover:bg-primary/90 transition-colors"
                  >
                    <Send className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Replies */}
        {hasReplies && discussion.showReplies && !isReply && (
          <div className="mt-2 space-y-2">
            {discussion.replies?.map((reply) =>
              renderDiscussion(reply as DiscussionWithUI, true)
            )}
          </div>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-full" id="discussions-section">
        {/* Sticky Header with Comment Input Skeleton */}
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
          <div className="flex items-center justify-between px-4 py-2.5">
            <div className="flex items-center gap-4">
              <Skeleton className="h-5 w-24" />
              <div className="flex items-center gap-1">
                <Skeleton className="h-7 w-16" />
                <Skeleton className="h-7 w-16" />
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Skeleton className="h-7 w-16" />
              <Skeleton className="h-7 w-16" />
            </div>
          </div>

          <div className="px-4 py-2.5 border-t">
            <div className="flex gap-2">
              <Skeleton className="flex-1 h-[60px]" />
              <Skeleton className="h-7 w-7" />
            </div>
          </div>
        </div>

        {/* Discussion List Skeleton */}
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="group relative transition-all duration-200">
              <div className="p-2.5">
                <div className="flex gap-3">
                  <Skeleton className="h-6 w-6 rounded-full" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-16" />
                      <div className="ml-auto flex items-center gap-1">
                        <Skeleton className="h-5 w-5" />
                        <Skeleton className="h-5 w-5" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-6 w-16" />
                        <Skeleton className="h-6 w-16" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full" id="discussions-section">
      {/* Sticky Header with Comment Input */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="flex items-center justify-between px-4 py-2.5">
          <div className="flex items-center gap-4">
            <h3 className="text-sm font-medium">Discussions</h3>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50"
              >
                <Pin className="h-3.5 w-3.5 mr-1.5" />
                Pinned ({pinnedDiscussions.length})
              </Button>
            </div>
          </div>
        </div>

        {/* Comment Input */}
        <div className="px-4 py-2.5 border-t">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Textarea
                placeholder="Add a comment... (use @ to mention someone)"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="min-h-[60px] resize-none pr-8 bg-background/50 backdrop-blur-sm border-muted/50 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-colors text-sm"
              />
              <div className="absolute right-1.5 bottom-1.5 flex items-center gap-0.5">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 hover:bg-muted/50"
                >
                  <Paperclip className="h-3 w-3" />
                </Button>
              </div>
            </div>
            <Button
              size="icon"
              onClick={handleAddComment}
              disabled={!newComment.trim()}
              className="self-end h-7 w-7 hover:bg-primary/90 transition-colors"
            >
              <Send className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Discussion List */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-3">
        {discussions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <MessageSquare className="h-4 w-4" />
              <span className="text-sm">No discussions yet</span>
            </div>
          </div>
        ) : (
          <>
            {/* Pinned Discussions */}
            {pinnedDiscussions.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Pin className="h-3.5 w-3.5" />
                  <span>Pinned Messages</span>
                </div>
                {pinnedDiscussions.map((discussion) =>
                  renderDiscussion(discussion)
                )}
              </div>
            )}

            {/* Unpinned Discussions */}
            {unpinnedDiscussions.length > 0 && (
              <div className="space-y-3">
                {pinnedDiscussions.length > 0 && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <MessageSquare className="h-3.5 w-3.5" />
                    <span>All Messages</span>
                  </div>
                )}
                {unpinnedDiscussions.map((discussion) =>
                  renderDiscussion(discussion)
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
