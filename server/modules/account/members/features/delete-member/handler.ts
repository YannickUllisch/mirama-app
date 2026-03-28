import type { AppContext } from '@/server/shared/infrastructure/types'
import type { OrganizationRole } from '@prisma/client'
import { MemberEntity } from '../../domain/member.entity'
import { MemberRepository } from '../../infrastructure/member.repo'

export const DeleteMemberCommand =
  ({ db, logger }: AppContext) =>
  async (
    memberId: string,
    sessionUserId: string,
    sessionRole: OrganizationRole,
  ) => {
    if (memberId === sessionUserId) {
      throw new Error('Cannot remove yourself from the organization')
    }

    logger.info({ memberId }, 'Deleting member')

    const repo = MemberRepository(db)
    const member = await repo.findById(memberId)

    if (!member) throw new Error('Member not found')

    MemberEntity.assertCanManage(member.role, sessionRole)

    await repo.remove(memberId)
  }
