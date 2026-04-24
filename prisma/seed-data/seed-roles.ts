

type AccessScope = "ORGANIZATION" | "PROJECT";

export type SeedRole = {
  name: string;
  description: string;
  scope: AccessScope;
  policyNames: string[];
};

const organizationRoles: SeedRole[] = [
  {
    name: "Owner",
    description: "Full unrestricted access — cannot be removed",
    scope: "ORGANIZATION",
    policyNames: ["full-access-policy"],
  },
  {
    name: "Admin",
    description:
      "Administrative access to organization settings, members, projects, and content",
    scope: "ORGANIZATION",
    policyNames: [
      "organization-manager-policy",
      "member-management-policy",
      "project-manager-policy",
    ],
  },
  {
    name: "Manager",
    description:
      "Manage projects, tasks, content, and team members without org-level settings access",
    scope: "ORGANIZATION",
    policyNames: [
      "member-management-policy",
      "project-manager-policy",
    ],
  },
  {
    name: "Member",
    description: "Read-only access across the organization",
    scope: "ORGANIZATION",
    policyNames: ["read-only-policy"],
  },
];

const projectRoles: SeedRole[] = [
  {
    name: "Project Lead",
    description: "Full control within the assigned project",
    scope: "PROJECT",
    policyNames: ["project-full-access-policy"],
  },
  {
    name: "Contributor",
    description:
      "Create and manage tasks, milestones, expenses, and comments within the project",
    scope: "PROJECT",
    policyNames: ["project-contributor-policy"],
  },
  {
    name: "Client",
    description:
      "Read tasks and leave review comments — designed for external client access",
    scope: "PROJECT",
    policyNames: ["project-reviewer-policy"],
  },
  {
    name: "Project Viewer",
    description: "Read-only access within the assigned project",
    scope: "PROJECT",
    policyNames: ["project-readonly-policy"],
  },
];

export const DEFAULT_SYSTEM_ROLES: SeedRole[] = [
  ...organizationRoles,
  ...projectRoles,
];