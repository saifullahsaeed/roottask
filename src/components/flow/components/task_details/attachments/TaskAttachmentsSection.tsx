import { useRef } from "react";
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
import { AttachmentsHeader } from "./AttachmentsHeader";
import { AttachmentList } from "./AttachmentList";
import { useTaskAttachments } from "./useTaskAttachments";

export function TaskAttachmentsSection({ taskId }: TaskAttachmentsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    attachments,
    isFetching,
    hasMore,
    totalAttachments,
    showDeleteDialog,
    setShowDeleteDialog,
    createAttachment,
    handleDelete,
    handleConfirmDelete,
    handleSetCover,
    loadMore,
    page,
  } = useTaskAttachments({ taskId });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        await createAttachment(file);
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
      />
      <AttachmentsHeader
        onUploadClick={handleUploadClick}
        isUploading={false}
      />

      <div className="space-y-3">
        <AttachmentList
          attachments={attachments}
          onDelete={handleDelete}
          onSetCover={handleSetCover}
          isDeleting={false}
          isSettingCover={false}
        />

        {hasMore && (
          <div className="flex flex-col items-center gap-2">
            <div className="text-sm text-muted-foreground">
              Showing {attachments.length} of {totalAttachments} attachments
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={loadMore}
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
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
