import type { OrganizationRole } from '@prisma/client'
import { MemberEntity } from '../../members/domain/member.entity'

const INVITATION_EXPIRY_DAYS = 1

// biome-ignore lint/complexity/noStaticOnlyClass: <tmp>
export class InvitationEntity {
  static assertCanInviteRole(
    invitedRole: OrganizationRole,
    sessionRole: OrganizationRole,
  ): void {
    MemberEntity.assertCanManage(invitedRole, sessionRole)
  }

  static createExpiryDate(): Date {
    const date = new Date()
    date.setDate(date.getDate() + INVITATION_EXPIRY_DAYS)
    return date
  }
}
