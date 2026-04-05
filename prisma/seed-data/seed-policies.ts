

export const DEFAULT_SYSTEM_POLICIES = [
  {
    name: "FullAccess",
    description: "Unrestricted access to all resources",
    isManaged: true,
    statements: [{ effect: "ALLOW", action: "*", resource: "*" }],
  },
  {
    name: "OrganizationManages",
    description: "Full control over organization settings and members",
    isManaged: true,
    statements: [
      { effect: "ALLOW", action: "organization:*", resource: "organization/*" },
      { effect: "ALLOW", action: "member:*", resource: "member/*" },
      { effect: "ALLOW", action: "team:*", resource: "team/*" },
    ],
  },
  {
    name: "ProjectManager",
    description: "Create, edit, and delete projects",
    isManaged: true,
    statements: [
      { effect: "ALLOW", action: "project:*", resource: "project/*" },
    ],
  },
  {
    name: "ReadOnly",
    description: "Read-only access to all resources",
    isManaged: true,
    statements: [
      { effect: "ALLOW", action: "*:read", resource: "*" },
      { effect: "ALLOW", action: "*:list", resource: "*" },
    ],
  },
] as const;