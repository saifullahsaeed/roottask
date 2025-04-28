import { Trash2, Loader2, Download, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui";
import { TaskAttachment } from "./types";

interface AttachmentActionsProps {
  attachment: TaskAttachment;
  onDelete: () => void;
  onSetCover: () => void;
  isDeleting: boolean;
  isSettingCover: boolean;
}

export function AttachmentActions({
  attachment,
  onDelete,
  onSetCover,
  isDeleting,
  isSettingCover,
}: AttachmentActionsProps) {
  return (
    <div className="flex items-center gap-2">
      {attachment.file.type.startsWith("image/") && (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
          onClick={onSetCover}
          disabled={isSettingCover}
        >
          {isSettingCover ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <ImageIcon className="w-4 h-4" />
          )}
        </Button>
      )}
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
        onClick={() => window.open(attachment.file.url, "_blank")}
      >
        <Download className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
        onClick={onDelete}
        disabled={isDeleting}
      >
        {isDeleting ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Trash2 className="w-4 h-4" />
        )}
      </Button>
    </div>
  );
}
