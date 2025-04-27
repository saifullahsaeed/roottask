import { Send, X } from "lucide-react";
import { Button } from "@/components/ui/";
import { Textarea } from "@/components/ui/textarea";
import type { DiscussionEditProps } from "./types";

export const DiscussionEdit = ({
  content,
  onSave,
  onCancel,
}: DiscussionEditProps) => (
  <div className="flex gap-2">
    <Textarea
      value={content}
      onChange={(e) => onSave(e.target.value)}
      className="flex-1 min-h-[60px] resize-none"
    />
    <div className="flex flex-col gap-1">
      <Button size="icon" onClick={() => onSave(content)} className="h-7 w-7">
        <Send className="h-3.5 w-3.5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={onCancel}
        className="h-7 w-7"
      >
        <X className="h-3.5 w-3.5" />
      </Button>
    </div>
  </div>
);
