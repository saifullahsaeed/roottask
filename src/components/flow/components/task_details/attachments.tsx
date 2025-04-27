"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Upload, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui";
import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/";

interface TaskAttachment {
  id: string;
  file: {
    id: string;
    name: string;
    type: string;
    size: number;
    url: string;
  };
  createdAt: string;
}

interface TaskAttachmentsProps {
  taskId: string;
}

export default function TaskAttachmentsSection({
  taskId,
}: TaskAttachmentsProps) {
  const queryClient = useQueryClient();
  const [showDeleteDialog, setShowDeleteDialog] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch attachments
  const { data: attachments = [], isLoading: isFetching } = useQuery({
    queryKey: ["task", taskId, "attachments"],
    queryFn: async () => {
      const response = await fetch(`/api/task/${taskId}/attachments`);
      if (!response.ok) throw new Error("Failed to fetch attachments");
      return response.json();
    },
  });

  // Create attachment mutation
  const createAttachmentMutation = useMutation({
    mutationFn: async (file: File) => {
      // First upload the file
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

      // Then create the attachment
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
    onSuccess: (newAttachment) => {
      queryClient.setQueryData(
        ["task", taskId, "attachments"],
        (old: TaskAttachment[] = []) => [...old, newAttachment]
      );
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
    onSuccess: (_, attachmentId) => {
      queryClient.setQueryData(
        ["task", taskId, "attachments"],
        (old: TaskAttachment[] = []) =>
          old.filter((attachment) => attachment.id !== attachmentId)
      );
    },
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        await createAttachmentMutation.mutateAsync(file);
        // Reset the input value to allow uploading the same file again
        e.target.value = "";
      } catch (error) {
        console.error("Error uploading file:", error);
        // You might want to show an error toast here
      }
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4" id="attachments-section">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">
          Attachments
        </h3>
        <div>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileUpload}
            disabled={createAttachmentMutation.isPending}
          />
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={handleUploadClick}
            disabled={createAttachmentMutation.isPending}
          >
            {createAttachmentMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Upload className="w-4 h-4" />
            )}
            Upload File
          </Button>
        </div>
      </div>

      {attachments.length > 0 ? (
        <div className="space-y-2">
          {attachments.map((attachment: TaskAttachment) => (
            <div
              key={attachment.id}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  {attachment.file.type.startsWith("image/") ? (
                    <img
                      src={attachment.file.url}
                      alt={attachment.file.name}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-xs font-medium">
                      {attachment.file.name.split(".").pop()?.toUpperCase()}
                    </span>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium">{attachment.file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(attachment.file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => setShowDeleteDialog(attachment.id)}
                disabled={deleteAttachmentMutation.isPending}
              >
                {deleteAttachmentMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 rounded-full bg-muted/30 text-muted-foreground flex items-center justify-center mb-4">
            <Upload className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-medium mb-2">No attachments yet</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Upload files to keep them organized with your task
          </p>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={handleUploadClick}
            disabled={createAttachmentMutation.isPending}
          >
            {createAttachmentMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Upload className="w-4 h-4" />
            )}
            Upload File
          </Button>
        </div>
      )}

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
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(null)}
              disabled={deleteAttachmentMutation.isPending}
            >
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
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
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
