import type { OrganizationRole } from '@prisma/client'

const ROLE_HIERARCHY: OrganizationRole[] = [
  'CLIENT',
  'USER',
  'FREELANCE',
  'ADMIN',
  'OWNER',
]

// biome-ignore lint/complexity/noStaticOnlyClass: <tmp>
export class MemberEntity {
  static isRoleHigher(role: OrganizationRole, than: OrganizationRole): boolean {
    return ROLE_HIERARCHY.indexOf(role) > ROLE_HIERARCHY.indexOf(than)
  }

  static assertCanManage(
    targetRole: OrganizationRole,
    sessionRole: OrganizationRole,
  ): void {
    if (MemberEntity.isRoleHigher(targetRole, sessionRole)) {
      throw new Error('Action not allowed: insufficient role')
    }
  }
}
