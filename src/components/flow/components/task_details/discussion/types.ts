import type { TaskCommentWithRelations } from "@/types";

export interface DiscussionWithUI extends TaskCommentWithRelations {
  showReplies: boolean;
  isEditing?: boolean;
  editContent?: string;
}

export interface DiscussionHeaderProps {
  userName: string;
  createdAt: Date;
  isPinned: boolean;
  isReply: boolean;
}

export interface DiscussionActionsProps {
  isLiked: boolean;
  likesCount: number;
  onLike: () => void;
  onReply: () => void;
  hasReplies: boolean;
  onToggleReplies: () => void;
  isReply: boolean;
}

export interface DiscussionEditProps {
  content: string;
  onSave: (content: string) => void;
  onCancel: () => void;
}

export interface DiscussionMenuProps {
  onEdit: () => void;
  onDelete: () => void;
}

export interface TaskDiscussionsSectionProps {
  taskId: string;
}

export interface Attachment {
  id: string;
  file: {
    id: string;
    name: string | null;
    url: string | null;
    type: string | null;
    thumbnail: string | null;
  };
}
