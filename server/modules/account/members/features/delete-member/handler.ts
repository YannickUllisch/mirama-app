import type { AppContext } from '@/server/shared/infrastructure/types'
import { MemberRepository } from '../../infrastructure/member.repo'

export const DeleteMemberCommand =
  ({ db, logger }: AppContext) =>
  async (memberId: string, sessionUserId: string) => {
    if (memberId === sessionUserId) {
      throw new Error('Cannot remove yourself from the organization')
    }

    logger.info({ memberId }, 'Deleting member')

    const repo = MemberRepository(db)
    const member = await repo.findById(memberId)

    if (!member) throw new Error('Member not found')

    await repo.remove(memberId)
  }
