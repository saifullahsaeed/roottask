"use client";

import { Upload } from "lucide-react";
import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";

interface TaskAttachmentsProps {
  taskId: string;
}

export default function TaskAttachmentsSection({
  taskId,
}: TaskAttachmentsProps) {
  return (
    <div className="space-y-2" id="attachments-section">
      <h3 className="text-sm font-medium text-muted-foreground mb-2">
        Attachments {taskId}
      </h3>

      <div
        className={cn(
          "flex flex-col items-center justify-center py-12 text-center border-2 border-dashed rounded-xl transition-colors"
        )}
      >
        <div className="w-16 h-16 rounded-full bg-muted/30 text-muted-foreground flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
          <Upload className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-medium mb-2">No attachments yet</h3>
        <p className="text-sm text-muted-foreground mb-4 max-w-sm">
          Drag and drop files here or click the button above to upload
        </p>
        <Button variant="outline" size="sm" className="gap-2">
          <Upload className="w-4 h-4" />
          Upload Files
        </Button>
      </div>
    </div>
  );
}
