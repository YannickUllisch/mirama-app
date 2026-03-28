import type { AppContext } from '@/server/shared/infrastructure/types'
import { MemberRepository } from '../../infrastructure/member.repo'
import { toMemberResponse } from '../response'

export const GetMembersQuery =
  ({ db, logger }: AppContext) =>
  async () => {
    logger.info('Fetching all members for the current organization')

    const repo = MemberRepository(db)
    const members = await repo.findAll()

    return members.map(toMemberResponse)
  }
