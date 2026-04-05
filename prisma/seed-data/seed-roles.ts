

export const DEFAULT_SYSTEM_ROLES = [
  {
    name: "Owner",
    description: "Full unrestricted access, cannot be removed",
    policyNames: ["FullAccess"],
  },
  {
    name: "Admin",
    description:
      "Administrative access to organizations, projects and members",
    policyNames: ["OrganizationManage", "ProjectManage", "TaskManage"],
  },
  {
    name: "Member",
    description: "Standard member with project and task access",
    policyNames: ["ProjectManage", "TaskManage"],
  },
  {
    name: "Viewer",
    description: "Read-only access across the tenant",
    policyNames: ["ReadOnly"],
  },
] as const;