// This file contains all the type definitions for the application
// It's based on the Prisma schema but simplified for frontend use

// API Response Types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

export interface PaginatedData<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: PaginatedData<T>;
  error?: string;
  status: number;
}

// Enums
export enum TaskPriority {
  URGENT = "URGENT",
  HIGH = "HIGH",
  MEDIUM = "MEDIUM",
  LOW = "LOW",
}

export enum TeamRole {
  OWNER = "OWNER",
  ADMIN = "ADMIN",
  MEMBER = "MEMBER",
  VIEWER = "VIEWER",
}

export enum Permission {
  CREATE_PROJECT = "CREATE_PROJECT",
  DELETE_PROJECT = "DELETE_PROJECT",
  EDIT_PROJECT = "EDIT_PROJECT",
  VIEW_PROJECT = "VIEW_PROJECT",
  MANAGE_TEAM = "MANAGE_TEAM",
  INVITE_MEMBERS = "INVITE_MEMBERS",
  REMOVE_MEMBERS = "REMOVE_MEMBERS",
  ASSIGN_TASKS = "ASSIGN_TASKS",
  CREATE_TASKS = "CREATE_TASKS",
  EDIT_TASKS = "EDIT_TASKS",
  DELETE_TASKS = "DELETE_TASKS",
  VIEW_TASKS = "VIEW_TASKS",
}

export enum ActivityType {
  TASK_CREATED = "TASK_CREATED",
  TASK_UPDATED = "TASK_UPDATED",
  TASK_DELETED = "TASK_DELETED",
  STATUS_CHANGED = "STATUS_CHANGED",
  ASSIGNED = "ASSIGNED",
  UNASSIGNED = "UNASSIGNED",
  COMMENT_ADDED = "COMMENT_ADDED",
  CHECKLIST_ADDED = "CHECKLIST_ADDED",
  CHECKLIST_COMPLETED = "CHECKLIST_COMPLETED",
  TAG_ADDED = "TAG_ADDED",
  TAG_REMOVED = "TAG_REMOVED",
  DEPENDENCY_ADDED = "DEPENDENCY_ADDED",
  DEPENDENCY_REMOVED = "DEPENDENCY_REMOVED",
}

export enum RecurrenceFrequency {
  DAILY = "DAILY",
  WEEKLY = "WEEKLY",
  MONTHLY = "MONTHLY",
  YEARLY = "YEARLY",
}

export enum WeekDay {
  MONDAY = "MONDAY",
  TUESDAY = "TUESDAY",
  WEDNESDAY = "WEDNESDAY",
  THURSDAY = "THURSDAY",
  FRIDAY = "FRIDAY",
  SATURDAY = "SATURDAY",
  SUNDAY = "SUNDAY",
}

// Base types (without relations)
export interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  emailVerified?: Date | null;
  image?: string | null;
  password?: string | null;
}

export interface Account {
  id: string;
  userId: string;
  type: string;
  provider: string;
  providerAccountId: string;
  refresh_token?: string | null;
  refresh_token_expires_in?: number | null;
  access_token?: string | null;
  expires_at?: number | null;
  token_type?: string | null;
  scope?: string | null;
  id_token?: string | null;
  session_state?: string | null;
}

export interface Session {
  id: string;
  sessionToken: string;
  userId: string;
  expires: Date;
}

export interface VerificationToken {
  identifier: string;
  token: string;
  expires: Date;
}

export interface Team {
  id: string;
  name: string;
  description?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface TeamMember {
  id: string;
  teamId: string;
  userId: string;
  role: TeamRole;
  joinedAt: Date;
}

export interface RolePermission {
  id: string;
  role: TeamRole;
  permission: Permission;
  createdAt: Date;
}

export interface Project {
  id: string;
  name: string;
  description?: string | null;
  createdAt: Date;
  updatedAt: Date;
  teamId: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string | null;
  priority?: TaskPriority | null;
  statusId?: string | null;
  position: number;
  isRecurring: boolean;
  recurrenceId?: string | null;
  parentTaskId?: string | null;
  createdById?: string | null;
  startDate?: Date | null;
  dueDate?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskStatus {
  id: string;
  name: string;
  description?: string | null;
  position: number;
  projectId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskChecklist {
  id: string;
  name: string;
  description?: string | null;
  taskId: string;
}

export interface TaskComment {
  id: string;
  content: string;
  taskId: string;
}

export interface TaskDependency {
  id: string;
  blockingTaskId: string;
  blockedTaskId: string;
  createdAt: Date;
}

export interface TaskAssignment {
  id: string;
  taskId: string;
  teamMemberId: string;
  assignedAt: Date;
}

export interface Tag {
  id: string;
  name: string;
  color?: string | null;
  description?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskTag {
  id: string;
  taskId: string;
  tagId: string;
  createdAt: Date;
}

export interface TaskActivity {
  id: string;
  taskId: string;
  type: ActivityType;
  description: string;
  metadata?: Record<string, unknown> | null;
  createdAt: Date;
  teamMemberId?: string | null;
}

// Define TaskActivityMetadata interface as it's not in Prisma schema
export interface TaskActivityMetadata {
  oldValue?: string | number | boolean | Date | null;
  newValue?: string | number | boolean | Date | null;
  additionalInfo?: Record<string, unknown>;
}

export interface RecurrencePattern {
  id: string;
  frequency: RecurrenceFrequency;
  interval: number;
  weekDays: WeekDay[];
  dayOfMonth?: number | null;
  monthOfYear?: number | null;
  endDate?: Date | null;
  maxOccurrences?: number | null;
  startTime?: Date | null;
  duration?: number | null;
}

export interface TaskAttachment {
  id: string;
  taskId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  fileUrl: string;
  thumbnailUrl?: string | null;
  mimeType: string;
  description?: string | null;
  createdAt: Date;
  updatedAt: Date;
  teamMemberId?: string | null;
}

// Extended types (with relations)
export interface UserWithRelations extends User {
  accounts?: AccountWithRelations[];
  sessions?: SessionWithRelations[];
  teamMemberships?: TeamMemberWithRelations[];
  createdTasks?: TaskWithRelations[];
}

export interface AccountWithRelations extends Account {
  user?: UserWithRelations;
}

export interface SessionWithRelations extends Session {
  user?: UserWithRelations;
}

export interface TeamWithRelations extends Team {
  members?: TeamMemberWithRelations[];
  projects?: ProjectWithRelations[];
}

export interface TeamMemberWithRelations extends TeamMember {
  team?: TeamWithRelations;
  user?: UserWithRelations;
  TaskAssignment?: TaskAssignmentWithRelations[];
  TaskActivity?: TaskActivityWithRelations[];
  TaskAttachment?: TaskAttachmentWithRelations[];
}

export interface ProjectWithRelations extends Project {
  team?: TeamWithRelations;
  statuses?: TaskStatusWithRelations[];
}

export interface TaskWithRelations extends Task {
  status?: TaskStatusWithRelations;
  checklist?: TaskChecklistWithRelations[];
  comments?: TaskCommentWithRelations[];
  assignments?: TaskAssignmentWithRelations[];
  tags?: TaskTagWithRelations[];
  activities?: TaskActivityWithRelations[];
  attachments?: TaskAttachmentWithRelations[];
  blockingTasks?: TaskDependencyWithRelations[];
  blockedByTasks?: TaskDependencyWithRelations[];
  recurrence?: RecurrencePatternWithRelations;
  parentTask?: TaskWithRelations;
  childTasks?: TaskWithRelations[];
  createdBy?: UserWithRelations;
}

export interface TaskStatusWithRelations extends TaskStatus {
  tasks?: TaskWithRelations[];
  taskCount?: number;
}

export interface TaskChecklistWithRelations extends TaskChecklist {
  task?: TaskWithRelations;
}

export interface TaskCommentWithRelations extends TaskComment {
  task?: TaskWithRelations;
}

export interface TaskDependencyWithRelations extends TaskDependency {
  blockingTask?: TaskWithRelations;
  blockedTask?: TaskWithRelations;
}

export interface TaskAssignmentWithRelations extends TaskAssignment {
  task?: TaskWithRelations;
  teamMember?: TeamMemberWithRelations;
}

export interface TaskTagWithRelations extends TaskTag {
  task?: TaskWithRelations;
  tag?: TagWithRelations;
}

export interface TaskActivityWithRelations extends TaskActivity {
  task?: TaskWithRelations;
  teamMember?: TeamMemberWithRelations;
}

export interface RecurrencePatternWithRelations extends RecurrencePattern {
  tasks?: TaskWithRelations[];
}

export interface TagWithRelations extends Tag {
  tasks?: TaskTagWithRelations[];
}

export interface TaskAttachmentWithRelations extends TaskAttachment {
  task?: TaskWithRelations;
  uploadedBy?: TeamMemberWithRelations;
}
