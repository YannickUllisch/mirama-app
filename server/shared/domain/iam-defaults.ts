/**
 * System-level default roles and policies.
 *
 * Roles with `tenantId: null` are global system defaults visible to every tenant.
 * Each tenant can additionally create custom roles scoped to their tenantId.
 *
 * This utility is idempotent — it only creates roles/policies that don't already exist.
 */

// Minimal duck-typed interface compatible with PrismaClient, transaction clients,
// and extended clients (ScopedDb) — avoids DefaultArgs vs InternalArgs mismatch.
type Tx = {
  role: {
    count: (...args: any[]) => Promise<any>
    findFirst: (...args: any[]) => Promise<any>
    create: (...args: any[]) => Promise<any>
  }
  policy: {
    findFirst: (...args: any[]) => Promise<any>
    create: (...args: any[]) => Promise<any>
  }
}

const SYSTEM_POLICIES = [
  {
    name: 'FullAccess',
    description: 'Unrestricted access to all resources',
    isManaged: true,
    statements: [{ effect: 'ALLOW', action: '*', resource: '*' }],
  },
  {
    name: 'OrganizationManage',
    description: 'Full control over organization settings and members',
    isManaged: true,
    statements: [
      { effect: 'ALLOW', action: 'organization:*', resource: 'organization/*' },
      { effect: 'ALLOW', action: 'member:*', resource: 'member/*' },
      { effect: 'ALLOW', action: 'team:*', resource: 'team/*' },
    ],
  },
  {
    name: 'ProjectManage',
    description: 'Create, edit, and delete projects',
    isManaged: true,
    statements: [
      { effect: 'ALLOW', action: 'project:*', resource: 'project/*' },
    ],
  },
  {
    name: 'TaskManage',
    description: 'Create, edit, assign, and close tasks',
    isManaged: true,
    statements: [{ effect: 'ALLOW', action: 'task:*', resource: 'task/*' }],
  },
  {
    name: 'ReadOnly',
    description: 'Read-only access to all resources',
    isManaged: true,
    statements: [
      { effect: 'ALLOW', action: '*:read', resource: '*' },
      { effect: 'ALLOW', action: '*:list', resource: '*' },
    ],
  },
] as const

const SYSTEM_ROLES = [
  {
    name: 'Owner',
    description: 'Full unrestricted access — cannot be removed',
    policyNames: ['FullAccess'],
  },
  {
    name: 'Admin',
    description:
      'Administrative access to organizations, projects, and members',
    policyNames: ['OrganizationManage', 'ProjectManage', 'TaskManage'],
  },
  {
    name: 'Member',
    description: 'Standard member with project and task access',
    policyNames: ['ProjectManage', 'TaskManage'],
  },
  {
    name: 'Viewer',
    description: 'Read-only access across the tenant',
    policyNames: ['ReadOnly'],
  },
] as const

/**
 * Ensures system-level (tenantId = null) roles and policies exist.
 * Safe to call on every user registration — skips existing records.
 */
export async function ensureSystemRolesExist(tx: Tx) {
  // Check if any system roles exist already
  const existingCount = await tx.role.count({ where: { tenantId: null } })
  if (existingCount >= SYSTEM_ROLES.length) return

  // Upsert policies
  const policyMap = new Map<string, string>()
  for (const pDef of SYSTEM_POLICIES) {
    let policy = await tx.policy.findFirst({
      where: { name: pDef.name, tenantId: null },
    })
    if (!policy) {
      policy = await tx.policy.create({
        data: {
          name: pDef.name,
          description: pDef.description,
          isManaged: pDef.isManaged,
          tenantId: null,
          statements: {
            create: pDef.statements.map((s) => ({
              effect: s.effect,
              action: s.action,
              resource: s.resource,
            })),
          },
        },
      })
    }
    policyMap.set(pDef.name, policy.id)
  }

  // Upsert roles
  for (const rDef of SYSTEM_ROLES) {
    const existing = await tx.role.findFirst({
      where: { name: rDef.name, tenantId: null },
    })
    if (existing) continue

    await tx.role.create({
      data: {
        name: rDef.name,
        description: rDef.description,
        tenantId: null,
        policies: {
          connect: rDef.policyNames
            .filter((pName) => policyMap.has(pName))
            .map((pName) => ({
              id: policyMap.get(pName) as string,
            })),
        },
      },
    })
  }
}

/**
 * Resolves a system-level role by name.
 * Used when creating org owners, accepting invitations, etc.
 */
export async function getSystemRole(tx: Tx, name: string) {
  const role = await tx.role.findFirst({
    where: { name, tenantId: null },
  })
  if (!role) {
    throw new Error(
      `System role "${name}" not found. Run ensureSystemRolesExist first.`,
    )
  }
  return role
}
