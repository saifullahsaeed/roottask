import { Paperclip } from "lucide-react";
import { Button } from "@/components/ui/";
import { cn } from "@/lib/utils";

interface AttachmentListProps {
  attachments: Array<{
    id: string;
    file: {
      id: string;
      name: string | null;
      url: string | null;
      type: string | null;
      thumbnail: string | null;
    };
  }>;
}

export const AttachmentList = ({ attachments }: AttachmentListProps) => (
  <div className="flex flex-wrap gap-2">
    {attachments.map((attachment) => (
      <Button
        key={attachment.id}
        variant="outline"
        size="sm"
        className={cn(
          "h-6 px-2 text-[11px] gap-1.5",
          "hover:bg-muted/50 hover:text-foreground"
        )}
        onClick={() => window.open(attachment.file.url || "#", "_blank")}
      >
        <Paperclip className="h-3 w-3" />
        <span className="truncate max-w-[120px]">
          {attachment.file.name || "Unnamed file"}
        </span>
      </Button>
    ))}
  </div>
);
