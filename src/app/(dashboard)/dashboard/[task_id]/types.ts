import type { Task, TaskPriority, ActivityType } from "@prisma/client";

export const mockTask: Task = {
  id: "TASK-123",
  title:
    "Implement comprehensive authentication and authorization system with OAuth 2.0, JWT, and multi-factor authentication",
  description: `We need to design and implement a robust authentication and authorization system that will serve as the foundation for our platform's security. This implementation should follow industry best practices and provide a seamless user experience.

Key Requirements:

1. Authentication Methods:
   • OAuth 2.0 integration with multiple providers
   • JWT-based session management
   • Multi-factor authentication support
   • Passwordless authentication options
   • Social login integration (Google, GitHub, Microsoft)

2. Security Features:
   • Rate limiting and brute force protection
   • Device fingerprinting and suspicious activity detection
   • Session management with automatic timeout
   • IP-based access controls
   • Audit logging for all authentication events

3. User Experience:
   • Streamlined login/registration flow
   • Self-service password reset
   • Account recovery options
   • Remember me functionality
   • Cross-device session management

4. Administrative Features:
   • User session management dashboard
   • Authentication audit logs
   • Custom security policy configuration
   • Role-based access control management

Technical Considerations:
- Use Auth0 as the primary OAuth provider
- Implement refresh token rotation
- Set up secure token storage
- Configure proper CORS policies
- Implement proper error handling and user feedback
- Ensure GDPR and CCPA compliance
- Set up monitoring and alerting for security events

Please refer to the attached security requirements document and system architecture diagram for detailed specifications.`,
  priority: TaskPriority.HIGH,
  status: {
    id: "status-123",
    name: "IN_PROGRESS",
    description: "In Progress",
    position: 1,
    tasks: [],
    projectId: "project-123",
    createdAt: new Date("2024-03-15"),
    updatedAt: new Date("2024-03-15"),
  },
  startDate: new Date("2024-03-15"),
  dueDate: new Date("2024-03-30"),
  cover: {
    type: "color",
    value: "#0ea5e9",
  },
  checklist: [
    {
      id: "cl1",
      name: "Authentication Setup",
      description: "Authentication Setup Checklist",
      taskId: "TASK-123",
      createdAt: new Date("2024-03-15"),
      updatedAt: new Date("2024-03-15"),
    },
    {
      id: "cl2",
      name: "Social Login Integration",
      description: "Social Login Integration Checklist",
      taskId: "TASK-123",
      createdAt: new Date("2024-03-15"),
      updatedAt: new Date("2024-03-15"),
    },
    {
      id: "cl3",
      name: "Multi-Factor Authentication",
      description: "Multi-Factor Authentication Checklist",
      taskId: "TASK-123",
      createdAt: new Date("2024-03-15"),
      updatedAt: new Date("2024-03-15"),
    },
  ],
  tags: [
    {
      id: "t1",
      tag: { id: "tag1", name: "Authentication", color: "#0ea5e9" },
    },
    {
      id: "t2",
      tag: { id: "tag2", name: "Security", color: "#dc2626" },
    },
    {
      id: "t3",
      tag: { id: "tag3", name: "Backend", color: "#8b5cf6" },
    },
    {
      id: "t4",
      tag: { id: "tag4", name: "High Priority", color: "#f59e0b" },
    },
    {
      id: "t5",
      tag: { id: "tag5", name: "Q2 Goals", color: "#10b981" },
    },
  ],
  attachments: [
    {
      id: "att1",
      name: "auth-system-architecture-v2.pdf",
      url: "/attachments/auth-system-architecture-v2.pdf",
      size: 2048000,
      type: "application/pdf",
      uploadedAt: new Date("2024-03-15T10:30:00Z"),
      uploadedBy: {
        id: "user1",
        name: "Sarah Chen",
        image: "/avatars/sarah.jpg",
        email: "sarah.chen@example.com",
        createdAt: new Date("2024-03-15"),
        updatedAt: new Date("2024-03-15"),
      },
    },
    {
      id: "att2",
      name: "security-requirements-spec.pdf",
      url: "/attachments/security-requirements-spec.pdf",
      size: 1536000,
      type: "application/pdf",
      uploadedAt: new Date("2024-03-15T11:15:00Z"),
      uploadedBy: {
        id: "user2",
        name: "Michael Ross",
        avatar: "/avatars/michael.jpg",
      },
    },
    {
      id: "att3",
      name: "auth-flow-sequence-diagram.png",
      url: "/attachments/auth-flow-sequence-diagram.png",
      size: 512000,
      type: "image/png",
      uploadedAt: new Date("2024-03-16T09:20:00Z"),
      uploadedBy: {
        id: "user3",
        name: "Emma Wilson",
        avatar: "/avatars/emma.jpg",
      },
    },
    {
      id: "att4",
      name: "oauth-providers-config.json",
      url: "/attachments/oauth-providers-config.json",
      size: 8192,
      type: "application/json",
      uploadedAt: new Date("2024-03-16T14:45:00Z"),
      uploadedBy: {
        id: "user4",
        name: "David Kumar",
        avatar: "/avatars/david.jpg",
      },
    },
  ],
  activities: [
    {
      id: "act1",
      type: ActivityType.TASK_CREATED,
      description: "Created task and assigned to Security team",
      createdAt: new Date("2024-03-15T09:00:00Z"),
      teamMember: {
        id: "user1",
        name: "Sarah Chen",
        avatar: "/avatars/sarah.jpg",
      },
    },
    {
      id: "act2",
      type: ActivityType.STATUS_CHANGED,
      description: "Changed status from 'Planned' to 'In Progress'",
      createdAt: new Date("2024-03-15T09:30:00Z"),
      teamMember: {
        id: "user2",
        name: "Michael Ross",
        avatar: "/avatars/michael.jpg",
      },
    },
    {
      id: "act3",
      type: ActivityType.ASSIGNED,
      description: "Added Emma Wilson to task",
      createdAt: new Date("2024-03-15T10:00:00Z"),
      teamMember: {
        id: "user1",
        name: "Sarah Chen",
        avatar: "/avatars/sarah.jpg",
      },
    },
    {
      id: "act4",
      type: ActivityType.TASK_UPDATED,
      description: "Added architecture diagram",
      createdAt: new Date("2024-03-15T10:30:00Z"),
      teamMember: {
        id: "user1",
        name: "Sarah Chen",
        avatar: "/avatars/sarah.jpg",
      },
    },
    {
      id: "act5",
      type: ActivityType.CHECKLIST_COMPLETED,
      description: "Completed 'Set up Auth0 development account'",
      createdAt: new Date("2024-03-16T11:15:00Z"),
      teamMember: {
        id: "user3",
        name: "Emma Wilson",
        avatar: "/avatars/emma.jpg",
      },
    },
    {
      id: "act6",
      type: ActivityType.TASK_UPDATED,
      description: "Changed priority from 'Medium' to 'High'",
      createdAt: new Date("2024-03-16T13:45:00Z"),
      teamMember: {
        id: "user2",
        name: "Michael Ross",
        avatar: "/avatars/michael.jpg",
      },
    },
    {
      id: "act7",
      type: ActivityType.ASSIGNED,
      description: "Added David Kumar to task",
      createdAt: new Date("2024-03-16T14:30:00Z"),
      teamMember: {
        id: "user1",
        name: "Sarah Chen",
        avatar: "/avatars/sarah.jpg",
      },
    },
  ],
  blockingTasks: [
    {
      id: "task-121",
      title: "Set up development environment and CI/CD pipeline",
      status: "COMPLETED",
    },
    {
      id: "task-122",
      title: "Configure cloud infrastructure for auth services",
      status: "IN_PROGRESS",
    },
  ],
  blockedByTasks: [
    {
      id: "task-124",
      title: "Security team approval for authentication architecture",
      status: "PENDING",
    },
  ],
  assignments: [
    {
      id: "asg1",
      assignedAt: new Date("2024-03-15T09:00:00Z"),
      teamMember: {
        id: "user1",
        name: "Sarah Chen",
        email: "sarah.chen@example.com",
        avatar: "/avatars/sarah.jpg",
      },
    },
    {
      id: "asg2",
      assignedAt: new Date("2024-03-15T10:00:00Z"),
      teamMember: {
        id: "user2",
        name: "Michael Ross",
        email: "michael.ross@example.com",
        avatar: "/avatars/michael.jpg",
      },
    },
    {
      id: "asg3",
      assignedAt: new Date("2024-03-15T10:00:00Z"),
      teamMember: {
        id: "user3",
        name: "Emma Wilson",
        email: "emma.wilson@example.com",
        avatar: "/avatars/emma.jpg",
      },
    },
    {
      id: "asg4",
      assignedAt: new Date("2024-03-16T14:30:00Z"),
      teamMember: {
        id: "user4",
        name: "David Kumar",
        email: "david.kumar@example.com",
        avatar: "/avatars/david.jpg",
      },
    },
  ],
  comments: [
    {
      id: "com1",
      content:
        "I've uploaded the initial system architecture diagram. The document outlines our approach to token management, session handling, and the overall authentication flow. @Michael, could you review the proposed flow for social login integration? We need to ensure it aligns with the rate limiting requirements.",
      createdAt: new Date("2024-03-15T10:35:00Z"),
      updatedAt: new Date("2024-03-15T10:35:00Z"),
      teamMember: {
        id: "user1",
        name: "Sarah Chen",
        avatar: "/avatars/sarah.jpg",
      },
      reactions: [
        { emoji: "👍", count: 3, reacted: true },
        { emoji: "🚀", count: 2, reacted: false },
      ],
    },
    {
      id: "com2",
      content:
        "The architecture looks solid! A few suggestions:\n\n1. We should add a cooldown period between authentication attempts to prevent brute force attacks. I suggest 60 seconds after 3 failed attempts.\n\n2. For social login, we should implement state parameter validation to prevent CSRF attacks.\n\n3. Consider adding a separate service for handling MFA to make it more scalable.",
      createdAt: new Date("2024-03-15T11:20:00Z"),
      updatedAt: new Date("2024-03-15T11:20:00Z"),
      teamMember: {
        id: "user2",
        name: "Michael Ross",
        avatar: "/avatars/michael.jpg",
      },
      reactions: [
        { emoji: "👍", count: 4, reacted: true },
        { emoji: "💡", count: 2, reacted: true },
      ],
    },
    {
      id: "com3",
      content:
        "I've started working on the Auth0 integration. The development account is set up and I've configured the initial application settings. I'll document the configuration steps in our wiki.",
      createdAt: new Date("2024-03-16T11:20:00Z"),
      updatedAt: new Date("2024-03-16T11:20:00Z"),
      teamMember: {
        id: "user3",
        name: "Emma Wilson",
        avatar: "/avatars/emma.jpg",
      },
      reactions: [{ emoji: "👍", count: 2, reacted: true }],
    },
    {
      id: "com4",
      content:
        "I've reviewed the security requirements and added some additional test cases to the checklist. We should also consider implementing progressive profiling for social login users to collect additional required information over time rather than all at once.",
      createdAt: new Date("2024-03-16T14:50:00Z"),
      updatedAt: new Date("2024-03-16T14:50:00Z"),
      teamMember: {
        id: "user4",
        name: "David Kumar",
        avatar: "/avatars/david.jpg",
      },
      reactions: [
        { emoji: "👍", count: 2, reacted: true },
        { emoji: "🤔", count: 1, reacted: false },
      ],
    },
    {
      id: "com5",
      content:
        "@David Great suggestion about progressive profiling! That would definitely improve the initial signup conversion rate. I'll add it to our backlog and we can discuss the implementation details in tomorrow's team meeting.",
      createdAt: new Date("2024-03-16T15:05:00Z"),
      updatedAt: new Date("2024-03-16T15:05:00Z"),
      teamMember: {
        id: "user1",
        name: "Sarah Chen",
        avatar: "/avatars/sarah.jpg",
      },
      reactions: [{ emoji: "👍", count: 3, reacted: true }],
    },
  ],
  isRecurring: false,
  parentTask: {
    id: "task-100",
    title: "Q2 2024 Security Infrastructure Upgrade",
    status: "IN_PROGRESS",
  },
  childTasks: [
    {
      id: "task-123-1",
      title: "Implement OAuth Provider Integration Service",
      status: "TODO",
    },
    {
      id: "task-123-2",
      title: "Build Admin Dashboard for Auth Management",
      status: "TODO",
    },
    {
      id: "task-123-3",
      title: "Create User Session Management Service",
      status: "TODO",
    },
  ],
};
