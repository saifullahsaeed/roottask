"use client";

import { format } from "date-fns";
import { Smile, AtSign, Send, MessageSquare, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui";
import { Task, TaskComment, TaskActivity as TaskActivityType } from "@/types";
import { cn } from "@/lib/utils";
import { useRef, useEffect } from "react";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

interface TaskActivityProps {
  activities: TaskActivityType[];
  comments: TaskComment[];
}

export function TaskActivity({ activities, comments }: TaskActivityProps) {
  const combinedActivities = [...activities, ...comments].sort(
    (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
  );

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [combinedActivities]);

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="h-12 px-5 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-sm font-medium">Activity</span>
        </div>
        <Button variant="ghost" size="icon" className="h-7 w-7">
          <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
        </Button>
      </div>

      {/* Scrollable Content */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto min-h-0">
        <div className="px-5 py-4 space-y-4 flex flex-col justify-end min-h-full">
          {/* Activity Feed */}
          <div className="space-y-3">
            {combinedActivities.map((item) => {
              const isComment = "content" in item;

              return (
                <div key={item.id} className="group">
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div
                        className={cn(
                          "w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium shrink-0 ring-2 ring-background transition-transform hover:scale-105",
                          isComment
                            ? "bg-primary/10 text-primary"
                            : "bg-muted text-muted-foreground"
                        )}
                        title={item.teamMember.name}
                      >
                        {getInitials(item.teamMember.name)}
                      </div>
                      {/* Timeline connector */}
                      <div className="w-px grow mt-2 bg-gradient-to-b from-border/50 to-border" />
                    </div>

                    <div className="flex-1 min-w-0 pb-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium">
                          {item.teamMember.name}
                        </span>
                        <span className="text-xs text-muted-foreground/80">
                          {format(item.createdAt, "h:mm a")}
                        </span>
                      </div>

                      {isComment ? (
                        <div className="relative group/message">
                          <div className="text-sm leading-relaxed break-words bg-gradient-to-br from-card/50 to-card/30 p-3 rounded-lg shadow-sm transition-all hover:shadow-md">
                            {item.content}
                          </div>

                          <div className="flex items-center gap-1.5 mt-2 h-5">
                            {item.reactions && item.reactions.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {item.reactions.map((reaction, index) => (
                                  <button
                                    key={index}
                                    className={cn(
                                      "inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-xs transition-all shadow-sm hover:shadow",
                                      reaction.reacted
                                        ? "bg-primary/10 text-primary hover:bg-primary/20"
                                        : "bg-muted hover:bg-muted/80"
                                    )}
                                  >
                                    <span>{reaction.emoji}</span>
                                    <span>{reaction.count}</span>
                                  </button>
                                ))}
                              </div>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-5 px-1.5 text-xs text-muted-foreground hover:text-foreground opacity-0 group-hover/message:opacity-100 transition-opacity ml-auto"
                            >
                              <Smile className="w-3.5 h-3.5 mr-1" />
                              React
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-xs text-muted-foreground bg-muted/40 py-1.5 px-2 rounded-md inline-block shadow-sm hover:shadow transition-all">
                          {item.description}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Comment Input - Fixed at bottom */}
      <div className="p-4 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shrink-0 shadow-lg">
        <div className="relative">
          <textarea
            placeholder="Write a comment..."
            className="w-full min-h-[80px] p-3 pr-24 rounded-lg bg-muted/50 border shadow-md resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm placeholder:text-muted-foreground/70"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                // Handle send message
              }
            }}
          />
          <div className="absolute right-2 bottom-2 flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground shadow-sm"
            >
              <AtSign className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground shadow-sm"
            >
              <Smile className="w-4 h-4" />
            </Button>
            <Button variant="default" size="icon" className="h-8 w-8 shadow-md">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
