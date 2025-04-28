import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/";
import { Button } from "@/components/ui";
import { Skeleton } from "@/components/ui/skeleton";
import { TaskAttachmentsProps } from "./types";
import { TaskAttachmentWithFile } from "@/types";
import { AttachmentsHeader } from "./AttachmentsHeader";
import { AttachmentList } from "./AttachmentList";

interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
}

export function TaskAttachmentsSection({
  taskId,
  nodeId,
}: TaskAttachmentsProps) {
  const queryClient = useQueryClient();
  const [showDeleteDialog, setShowDeleteDialog] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [page, setPage] = useState(1);
  const limit = 10;

  // Fetch attachments with pagination
  const { data, isLoading: isFetching } = useQuery({
    queryKey: ["task-attachments", taskId, page],
    queryFn: async (): Promise<PaginatedResponse<TaskAttachmentWithFile>> => {
      const response = await fetch(
        `/api/task/${taskId}/attachments?page=${page}&limit=${limit}`
      );
      if (!response.ok) throw new Error("Failed to fetch attachments");
      return response.json();
    },
    staleTime: 0,
    gcTime: 0,
  });

  const attachments = data?.data || [];
  const hasMore = data?.pagination ? page < data.pagination.totalPages : false;
  const totalAttachments = data?.pagination?.total || 0;

  // Create attachment mutation
  const createAttachmentMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        const error = await uploadResponse.json();
        throw new Error(error.message || "Failed to upload file");
      }

      const { id: fileId } = await uploadResponse.json();

      const attachmentResponse = await fetch(
        `/api/task/${taskId}/attachments`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fileId }),
        }
      );

      if (!attachmentResponse.ok) {
        const error = await attachmentResponse.json();
        throw new Error(error.message || "Failed to create attachment");
      }

      return attachmentResponse.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`task-${nodeId}`] });
    },
  });

  // Delete attachment mutation
  const deleteAttachmentMutation = useMutation({
    mutationFn: async (attachmentId: string) => {
      const response = await fetch(
        `/api/task/${taskId}/attachments/${attachmentId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete attachment");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`task-${nodeId}`] });
    },
  });

  // Update cover mutation
  const updateCoverMutation = useMutation({
    mutationFn: async (attachmentId: string | null) => {
      const response = await fetch(`/api/task/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ coverId: attachmentId }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update cover");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`task-${nodeId}`] });
    },
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        await createAttachmentMutation.mutateAsync(file);
        e.target.value = "";
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  if (isFetching && page === 1) {
    return (
      <div className="space-y-4" id="attachments-section">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-8 w-20" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 rounded-lg border border-border"
            >
              <div className="flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-3 w-12" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4" id="attachments-section">
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileUpload}
        disabled={createAttachmentMutation.isPending}
      />
      <AttachmentsHeader
        taskId={taskId}
        nodeId={nodeId}
        onUploadClick={handleUploadClick}
        isUploading={createAttachmentMutation.isPending}
      />

      <div className="space-y-3">
        <AttachmentList
          attachments={attachments}
          onDelete={(id) => setShowDeleteDialog(id)}
          onSetCover={(id) => updateCoverMutation.mutate(id)}
          isDeleting={deleteAttachmentMutation.isPending}
          isSettingCover={updateCoverMutation.isPending}
        />

        {hasMore && (
          <div className="flex flex-col items-center gap-2">
            <div className="text-sm text-muted-foreground">
              Showing {attachments.length} of {totalAttachments} attachments
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => p + 1)}
              disabled={isFetching}
              className="w-full max-w-[200px]"
            >
              {isFetching ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                  Loading more...
                </div>
              ) : (
                "Load More"
              )}
            </Button>
          </div>
        )}

        {!hasMore && totalAttachments > 0 && (
          <div className="text-center text-sm text-muted-foreground">
            Showing all {totalAttachments} attachments
          </div>
        )}
      </div>

      <Dialog
        open={!!showDeleteDialog}
        onOpenChange={() => setShowDeleteDialog(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Attachment</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this attachment? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (showDeleteDialog) {
                  deleteAttachmentMutation.mutate(showDeleteDialog);
                  setShowDeleteDialog(null);
                }
              }}
              disabled={deleteAttachmentMutation.isPending}
            >
              {deleteAttachmentMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
