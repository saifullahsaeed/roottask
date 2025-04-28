import { Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui";
import { TaskAttachmentsProps } from "./types";

interface AttachmentsHeaderProps extends TaskAttachmentsProps {
  onUploadClick: () => void;
  isUploading: boolean;
}

export function AttachmentsHeader({
  onUploadClick,
  isUploading,
}: AttachmentsHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <h3 className="text-base font-medium text-foreground">Attachments</h3>
      <div>
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={onUploadClick}
          disabled={isUploading}
        >
          {isUploading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Upload className="w-4 h-4" />
          )}
          Upload
        </Button>
      </div>
    </div>
  );
}
