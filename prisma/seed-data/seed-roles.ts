

type AccessScope = "ORGANIZATION" | "PROJECT";

export type SeedRole = {
  name: string;
  description: string;
  scope: AccessScope;
  policyNames: string[];
};

// ── Organization-scoped roles ──────────────────────────────────────────────

const organizationRoles: SeedRole[] = [
  {
    name: "Owner",
    description: "Full unrestricted access — cannot be removed",
    scope: "ORGANIZATION",
    policyNames: ["FullAccess"],
  },
  {
    name: "Admin",
    description:
      "Administrative access to organization settings, members, projects, and content",
    scope: "ORGANIZATION",
    policyNames: [
      "OrganizationManage",
      "MemberManage",
      "ProjectManage",
      "TaskManage",
      "ContentManage",
    ],
  },
  {
    name: "Manager",
    description:
      "Manage projects, tasks, content, and team members without org-level settings access",
    scope: "ORGANIZATION",
    policyNames: [
      "MemberManage",
      "ProjectManage",
      "TaskManage",
      "ContentManage",
    ],
  },
  {
    name: "Member",
    description:
      "Standard member with task, comment, and content access plus read-only project visibility",
    scope: "ORGANIZATION",
    policyNames: ["TaskManage", "ContentManage", "ReadOnly"],
  },
  {
    name: "Viewer",
    description: "Read-only access across the organization",
    scope: "ORGANIZATION",
    policyNames: ["ReadOnly"],
  },
];

// ── Project-scoped roles ───────────────────────────────────────────────────

const projectRoles: SeedRole[] = [
  {
    name: "Project Lead",
    description: "Full control within the assigned project",
    scope: "PROJECT",
    policyNames: ["ProjectFullAccess"],
  },
  {
    name: "Contributor",
    description:
      "Create and manage tasks, milestones, expenses, and comments within the project",
    scope: "PROJECT",
    policyNames: ["ProjectContribute"],
  },
  {
    name: "Client",
    description:
      "Read tasks and leave review comments — designed for external client access",
    scope: "PROJECT",
    policyNames: ["ProjectReview"],
  },
  {
    name: "Project Viewer",
    description: "Read-only access within the assigned project",
    scope: "PROJECT",
    policyNames: ["ProjectReadOnly"],
  },
];

export const DEFAULT_SYSTEM_ROLES: SeedRole[] = [
  ...organizationRoles,
  ...projectRoles,
];