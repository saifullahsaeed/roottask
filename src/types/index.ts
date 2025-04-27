import type {
  Task,
  TaskAssignee,
  TaskAttachment,
  TaskChecklist,
  TaskChecklistItem,
  File,
  User,
  TaskComment,
  TaskCommentLike,
} from "@prisma/client";

export type TaskCommentWithRelations = TaskComment & {
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
  replies: (TaskComment & {
    user: {
      id: string;
      name: string | null;
      image: string | null;
    };
    likes: TaskCommentLike[];
  })[];
  likes: TaskCommentLike[];
  attachments: (TaskAttachment & {
    file: File;
  })[];
};

export type TaskWithRelations = Task & {
  attachments: TaskAttachmentWithFile[];
  checklists: TaskChecklistWithItems[];
  assignees: AssigneeWithUser[];
  cover: TaskAttachmentWithFile;
  comments?: TaskCommentWithRelations[];
};

export type TaskChecklistWithItems = TaskChecklist & {
  items: TaskChecklistItem[];
};

export type TaskAttachmentWithFile = TaskAttachment & {
  file: File;
};

export type AssigneeWithUser = TaskAssignee & {
  user: User;
};

export type TaskForNode = Task & {
  assignees?: AssigneeWithUser[];
  assigneesIds?: string[];
};
