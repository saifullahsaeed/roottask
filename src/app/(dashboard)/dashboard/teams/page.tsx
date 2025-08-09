"use client";
import { WorkspaceMemberWithUser, WorkspaceWithMembers } from "@/types";
import { Users, Pencil, UserPlus, MoreVertical } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input/input";
import { useQuery } from "@tanstack/react-query";
import React, { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu/dropdown-menu";

export default function TeamsPage() {
  // Fetch workspaces
  const {
    data: workspaces,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["workspaces"],
    queryFn: getWorkspaces,
  });

  const { data: session } = useSession();

  // Fetch workspaces API
  function getWorkspaces() {
    return fetch("/api/workspaces").then((res) => res.json());
  }

  // State for editing workspaces by id
  const [editModes, setEditModes] = useState<{ [id: string]: boolean }>({});
  const [isSaving, setIsSaving] = useState<{ [id: string]: boolean }>({});
  const [workspaceNames, setWorkspaceNames] = useState<{
    [id: string]: string;
  }>({});
  const [newNames, setNewNames] = useState<{ [id: string]: string }>({});
  const inputRefs = useRef<{ [id: string]: HTMLInputElement | null }>({});

  // Sync workspace names with data
  useEffect(() => {
    if (workspaces) {
      const names: { [id: string]: string } = {};
      workspaces.forEach((ws: WorkspaceWithMembers) => {
        names[ws.id] = ws.name;
      });
      setWorkspaceNames(names);
      setNewNames(names);
    }
  }, [workspaces]);

  const handleEdit = (id: string) => {
    setEditModes((prev) => ({ ...prev, [id]: true }));
    setTimeout(() => {
      inputRefs.current[id]?.focus();
    }, 0);
  };

  const handleCancel = (id: string) => {
    setEditModes((prev) => ({ ...prev, [id]: false }));
    setNewNames((prev) => ({ ...prev, [id]: workspaceNames[id] }));
  };

  const handleChange = (id: string, value: string) => {
    setNewNames((prev) => ({ ...prev, [id]: value }));
  };

  const handleSave = async (id: string) => {
    if (newNames[id].trim() === "" || newNames[id] === workspaceNames[id]) {
      setEditModes((prev) => ({ ...prev, [id]: false }));
      setNewNames((prev) => ({ ...prev, [id]: workspaceNames[id] }));
      return;
    }
    setIsSaving((prev) => ({ ...prev, [id]: true }));
    try {
      const res = await fetch(`/api/workspace/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newNames[id] }),
      });
      if (!res.ok) throw new Error("Failed to update workspace name");
      setWorkspaceNames((prev) => ({ ...prev, [id]: newNames[id] }));
      setEditModes((prev) => ({ ...prev, [id]: false }));
    } catch {
      setNewNames((prev) => ({ ...prev, [id]: workspaceNames[id] }));
      setEditModes((prev) => ({ ...prev, [id]: false }));
    } finally {
      setIsSaving((prev) => ({ ...prev, [id]: false }));
    }
  };

  // Render
  return (
    <div className="max-w-2xl mx-auto py-8 px-2">
      {isLoading ? (
        <div className="space-y-6">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="bg-white dark:bg-zinc-900 rounded-xl shadow border border-border p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-6 w-6 rounded-full" />
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-12 ml-2" />
                </div>
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
              <div className="divide-y divide-border">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="flex items-center gap-3 py-2">
                    <Skeleton className="h-7 w-7 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-24 mb-1" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                    <Skeleton className="h-4 w-12 rounded" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-red-500 text-center py-8">
          Error: {error.message}
        </div>
      ) : !workspaces || workspaces.length === 0 ? (
        <div className="text-muted-foreground text-center py-16">
          <Users className="h-10 w-10 mx-auto mb-2 text-primary" />
          <div className="text-lg font-semibold mb-1">No workspace found</div>
          <div className="text-sm mb-4">You are not part of any workspace.</div>
        </div>
      ) : (
        <div className="space-y-6">
          {workspaces.map((workspace: WorkspaceWithMembers) => {
            const currentMember = workspace.members.find(
              (member) => member.userId === session?.user?.id
            );
            const isAdmin = currentMember?.role === "ADMIN";
            const editMode = !!editModes[workspace.id];
            const saving = !!isSaving[workspace.id];
            const workspaceName =
              workspaceNames[workspace.id] ?? workspace.name;
            const newName = newNames[workspace.id] ?? workspace.name;
            return (
              <div
                key={workspace.id}
                className="bg-white dark:bg-zinc-900 rounded-xl shadow border border-border p-0 overflow-hidden"
              >
                {/* Header */}
                <div className="flex items-center justify-between gap-2 px-4 py-3 border-b border-border bg-zinc-50 dark:bg-zinc-900/70">
                  <div className="flex items-center gap-2 min-w-0">
                    <Users className="h-6 w-6 text-primary shrink-0" />
                    {isAdmin && editMode ? (
                      <Input
                        ref={(el) => {
                          inputRefs.current[workspace.id] = el;
                        }}
                        className="text-xl font-bold bg-transparent border-b border-primary focus:outline-none focus:border-primary px-1 min-w-0 max-w-[180px]"
                        value={newName}
                        onChange={(e) =>
                          handleChange(workspace.id, e.target.value)
                        }
                        onBlur={() => handleSave(workspace.id)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter")
                            inputRefs.current[workspace.id]?.blur();
                          else if (e.key === "Escape")
                            handleCancel(workspace.id);
                        }}
                        disabled={saving}
                        autoFocus
                      />
                    ) : (
                      <span className="text-xl font-bold truncate max-w-[180px]">
                        {workspaceName}
                      </span>
                    )}
                    <span
                      className={`ml-2 text-xs px-2 py-0.5 rounded font-medium border border-border ${
                        isAdmin
                          ? "bg-primary/10 text-primary"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {isAdmin ? "Admin" : "Member"}
                    </span>
                    {isAdmin && !editMode && (
                      <button
                        className="ml-1 p-1 rounded hover:bg-accent/40 transition-colors"
                        title="Edit workspace"
                        aria-label="Edit workspace"
                        onClick={() => handleEdit(workspace.id)}
                      >
                        <Pencil className="h-4 w-4 text-muted-foreground" />
                      </button>
                    )}
                  </div>
                  {/* IconButton for Invite */}
                  <button
                    className="p-2 rounded-full hover:bg-primary/10 transition-colors group"
                    type="button"
                    title="Invite members"
                    aria-label="Invite members"
                    onClick={() => {}}
                    disabled={saving}
                  >
                    <UserPlus className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                  </button>
                </div>
                {/* Member List */}
                <div className="divide-y divide-border">
                  {workspace.members.map((member: WorkspaceMemberWithUser) => {
                    const isSelf = member.userId === session?.user?.id;
                    return (
                      <div
                        key={member.id}
                        className="flex items-center gap-3 px-4 py-2 group hover:bg-accent/20 transition-colors"
                      >
                        <Avatar className="w-7 h-7 border-2 border-white dark:border-zinc-900">
                          <AvatarFallback
                            name={
                              member.user?.name ||
                              member.user?.email ||
                              String(member.userId)
                            }
                          />
                        </Avatar>
                        <div className="flex flex-col min-w-0 flex-1">
                          <span className="font-medium text-sm truncate">
                            {member.user?.name || member.userId}
                          </span>
                          {member.user?.email && (
                            <span className="text-xs text-muted-foreground truncate">
                              {member.user.email}
                            </span>
                          )}
                        </div>
                        <span
                          className={`text-xs px-2 py-0.5 rounded font-medium border border-border ${
                            member.role === "ADMIN"
                              ? "bg-primary/10 text-primary"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {member.role}
                        </span>
                        {/* User actions dropdown: only if you are admin, not for yourself */}
                        {isAdmin && !isSelf && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button
                                className="ml-2 p-1 rounded-full hover:bg-accent/30 transition-colors"
                                aria-label="User actions"
                                type="button"
                              >
                                <MoreVertical className="h-4 w-4 text-muted-foreground" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>
                                Member Actions
                              </DropdownMenuLabel>
                              <DropdownMenuSub>
                                <DropdownMenuSubTrigger>
                                  Change Role
                                </DropdownMenuSubTrigger>
                                <DropdownMenuSubContent>
                                  <DropdownMenuItem>Admin</DropdownMenuItem>
                                  <DropdownMenuItem>Member</DropdownMenuItem>
                                </DropdownMenuSubContent>
                              </DropdownMenuSub>
                              <DropdownMenuSeparator />
                              {/* Defensive: never show remove for yourself */}
                              <DropdownMenuItem className="text-red-600">
                                Remove from Workspace
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
