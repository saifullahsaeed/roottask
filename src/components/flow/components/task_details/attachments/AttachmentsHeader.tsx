import { Button } from "@/components/ui";
import { Plus } from "lucide-react";

interface AttachmentsHeaderProps {
  onUploadClick: () => void;
  isUploading: boolean;
}

export function AttachmentsHeader({
  onUploadClick,
  isUploading,
}: AttachmentsHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <h3 className="text-lg font-semibold">Attachments</h3>
      <Button
        variant="outline"
        size="sm"
        onClick={onUploadClick}
        disabled={isUploading}
      >
        <Plus className="h-4 w-4 mr-2" />
        {isUploading ? "Uploading..." : "Upload"}
      </Button>
    </div>
  );
}
