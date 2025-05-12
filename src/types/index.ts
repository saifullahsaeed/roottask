// All shared types should be defined and imported from this file only.
// Do not define types inline in components or pages; import from here.

import type {
  Task,
  TaskAssignee,
  TaskAttachment,
  TaskChecklist,
  TaskChecklistItem,
  File,
  TaskFlow,
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

export type DashboardProject = {
  id: string;
  name: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  taskFlowCount: number;
  taskCount: number;
  lastActivity: string;
  createdByUser?: { name?: string | null; email?: string | null };
};

export type TaskFlowWithMetaData = TaskFlow & {
  totalTasks?: number | null;
  completedTasks?: number | null;
  dateRange: {
    startDate: string;
    endDate: string;
  };
  assignedTo: User[] | [];
};
