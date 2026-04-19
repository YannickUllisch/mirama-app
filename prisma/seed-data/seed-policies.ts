import { AccessScope } from "../generated/client";

export type SeedPolicyStatement = {
  effect: "ALLOW" | "DENY";
  action: string;
  resource: string;
};

export type SeedPolicy = {
  name: string;
  description: string;
  isManaged: boolean;
  scope: AccessScope;
  statements: SeedPolicyStatement[];
};


const organizationPolicies: SeedPolicy[] = [
  {
    name: "full-access-policy",
    description: "Unrestricted access to all resources",
    isManaged: true,
    scope: "ORGANIZATION",
    statements: [{ effect: "ALLOW", action: "*", resource: "*" }],
  },
  {
    name: "organization-manager-policy",
    description: "Manage organization settings and configuration",
    isManaged: true,
    scope: "ORGANIZATION",
    statements: [
      { effect: "ALLOW", action: "organization:read", resource: "organization/*" },
      { effect: "ALLOW", action: "organization:update", resource: "organization/*" },
    ],
  },
  {
    name: "member-management-policy",
    description: "Full control over members, invitations and teams",
    isManaged: true,
    scope: "ORGANIZATION",
    statements: [
      { effect: "ALLOW", action: "member:*", resource: "member/*" },
      { effect: "ALLOW", action: "invitation:*", resource: "invitation/*" },
      { effect: "ALLOW", action: "team:*", resource: "team/*" },
      { effect: "ALLOW", action: "teammember:*", resource: "teammember/*" },
    ],
  },
  {
    name: "project-manager-policy",
    description: "Full CRUD on all projects across the organization",
    isManaged: true,
    scope: "ORGANIZATION",
    statements: [
      { effect: "ALLOW", action: "project:*", resource: "project/*" },
      { effect: "ALLOW", action: "task:*", resource: "task/*" },
      { effect: "ALLOW", action: "comment:*", resource: "comment/*" },
      { effect: "ALLOW", action: "expense:*", resource: "expense/*" },
      { effect: "ALLOW", action: "milestone:*", resource: "milestone/*" },
      { effect: "ALLOW", action: "tag:*", resource: "tag/*" },
    ],
  },
  {
    name: "read-only-policy",
    description: "Read-only access to all resources at the organization level",
    isManaged: true,
    scope: "ORGANIZATION",
    statements: [
      { effect: "ALLOW", action: "*:read", resource: "*" },
    ],
  },
];


const projectPolicies: SeedPolicy[] = [
  {
    name: "project-full-access-policy",
    description: "Unrestricted access within a project",
    isManaged: true,
    scope: "PROJECT",
    statements: [{ effect: "ALLOW", action: "*", resource: "*" }],
  },
  {
    name: "project-contributor-policy",
    description: "Create and manage tasks, milestones, comments, and expenses within a project",
    isManaged: true,
    scope: "PROJECT",
    statements: [
      { effect: "ALLOW", action: "project:read", resource: "project/*" },
      { effect: "ALLOW", action: "task:read", resource: "task/*" },
      { effect: "ALLOW", action: "task:create", resource: "task/*" },
      { effect: "ALLOW", action: "task:update", resource: "task/*" },
      { effect: "ALLOW", action: "task:assign", resource: "task/*" },
      { effect: "ALLOW", action: "comment:*", resource: "comment/*" },
      { effect: "ALLOW", action: "milestone:read", resource: "milestone/*" },
      { effect: "ALLOW", action: "milestone:create", resource: "milestone/*" },
      { effect: "ALLOW", action: "milestone:update", resource: "milestone/*" },
      { effect: "ALLOW", action: "expense:*", resource: "expense/*" },
      { effect: "ALLOW", action: "tag:read", resource: "tag/*" },
    ],
  },
  {
    name: "project-reviewer-policy",
    description: "Read-only access with the ability to leave comments — ideal for client reviews",
    isManaged: true,
    scope: "PROJECT",
    statements: [
      { effect: "ALLOW", action: "project:read", resource: "project/*" },
      { effect: "ALLOW", action: "task:read", resource: "task/*" },
      { effect: "ALLOW", action: "comment:read", resource: "comment/*" },
      { effect: "ALLOW", action: "comment:create", resource: "comment/*" },
      { effect: "ALLOW", action: "milestone:read", resource: "milestone/*" },
      { effect: "ALLOW", action: "expense:read", resource: "expense/*" },
      { effect: "ALLOW", action: "tag:read", resource: "tag/*" },
    ],
  },
  {
    name: "project-readonly-policy",
    description: "Read-only access within a project",
    isManaged: true,
    scope: "PROJECT",
    statements: [
      { effect: "ALLOW", action: "*:read", resource: "*" },
    ],
  },
];

export const DEFAULT_SYSTEM_POLICIES: SeedPolicy[] = [
  ...organizationPolicies,
  ...projectPolicies,
];