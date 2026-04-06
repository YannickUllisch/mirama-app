// server/shared/domain/resolve-permissions.ts
import database from '@db'

/**
 * Resolves the flattened set of granted "resource:action" permission strings
 * for a given member. When a projectId is supplied the result is the union
 * of the member's organization‑level role permissions AND their project‑level
 * role permissions.
 *
 * Wildcard statements (action "*" or resource "*") are expanded at
 * evaluation time by the client‑side `can()` helper — we store them
 * as‑is so the set stays small and serialisable.
 */
export const resolvePermissions = async (
  userEmail: string,
  organizationId: string,
  projectId?: string,
): Promise<string[]> => {
  // 1. Fetch org‑level member → iamRole → policies → statements
  const orgMember = await database.member.findFirst({
    where: { email: userEmail, organizationId },
    select: {
      iamRole: {
        select: {
          policies: {
            select: {
              statements: {
                select: { effect: true, action: true, resource: true },
              },
            },
          },
        },
      },
    },
  })

  const statements: { effect: string; action: string; resource: string }[] = []

  if (orgMember?.iamRole) {
    for (const policy of orgMember.iamRole.policies) {
      for (const s of policy.statements) {
        statements.push(s)
      }
    }
  }

  // 2. Optionally fetch project‑level role → policies → statements
  if (projectId && orgMember) {
    const projectMember = await database.projectMember.findFirst({
      where: {
        projectId,
        member: { email: userEmail, organizationId },
      },
      select: {
        role: {
          select: {
            policies: {
              select: {
                statements: {
                  select: { effect: true, action: true, resource: true },
                },
              },
            },
          },
        },
      },
    })

    if (projectMember?.role) {
      for (const policy of projectMember.role.policies) {
        for (const s of policy.statements) {
          statements.push(s)
        }
      }
    }
  }

  // 3. Build — ALLOW minus DENY
  const allowed = new Set<string>()
  const denied = new Set<string>()

  for (const s of statements) {
    const key = `${s.action}::${s.resource}`
    if (s.effect === 'DENY') {
      denied.add(key)
    } else {
      allowed.add(key)
    }
  }

  // Remove explicitly denied entries
  for (const d of denied) {
    allowed.delete(d)
  }

  return Array.from(allowed)
}
