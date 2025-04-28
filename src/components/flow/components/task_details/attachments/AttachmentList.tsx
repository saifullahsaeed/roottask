import Image from "next/image";
import { File } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { TaskAttachmentWithFile } from "@/types";
import { AttachmentActions } from "./AttachmentActions";

interface AttachmentListProps {
  attachments: TaskAttachmentWithFile[];
  onDelete: (id: string) => void;
  onSetCover: (id: string) => void;
  isDeleting: boolean;
  isSettingCover: boolean;
}

export function AttachmentList({
  attachments,
  onDelete,
  onSetCover,
  isDeleting,
  isSettingCover,
}: AttachmentListProps) {
  if (attachments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-border rounded-lg">
        <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
          <File className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-medium mb-2">No attachments yet</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Upload files to keep them organized with your task
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {attachments.map((attachment) => (
        <div key={attachment.id}>
          <div className="flex items-center justify-between p-3 rounded-lg border border-border hover:border-primary/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center overflow-hidden">
                {attachment.file.type?.startsWith("image/") ? (
                  <Image
                    src={attachment.file.url}
                    alt={attachment.file.name || ""}
                    className="w-full h-full object-cover"
                    width={40}
                    height={40}
                  />
                ) : (
                  <File className="w-5 h-5" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium">{attachment.file.name}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>
                    {attachment.file.type?.split("/")[1]?.toUpperCase() ||
                      "FILE"}
                  </span>
                  <span>•</span>
                  <span>
                    {attachment.file.size
                      ? (attachment.file.size / 1024).toFixed(1)
                      : "0"}
                    KB
                  </span>
                  <span>•</span>
                  <span>
                    {formatDistanceToNow(new Date(attachment.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
              </div>
            </div>
            <AttachmentActions
              attachment={attachment}
              onDelete={() => onDelete(attachment.id)}
              onSetCover={() => onSetCover(attachment.id)}
              isDeleting={isDeleting}
              isSettingCover={isSettingCover}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
