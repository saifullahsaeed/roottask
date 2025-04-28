import { TaskAttachmentWithFile } from "@/types";

export interface TaskAttachmentsProps {
  taskId: string;
  nodeId: string;
}

export interface AttachmentListProps {
  attachments: TaskAttachmentWithFile[];
  onDelete: (id: string) => void;
  onSetCover: (id: string | null) => void;
  isDeleting: boolean;
  isSettingCover: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
