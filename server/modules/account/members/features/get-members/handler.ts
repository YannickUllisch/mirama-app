import type { AppContext } from '@/server/shared/infrastructure/types'
import { MemberRepository } from '../../infrastructure/member.repo'
import { toMemberResponse } from '../response'

export const GetMembersQuery =
  ({ db }: AppContext) =>
  async () => {
    const repo = MemberRepository(db)
    const members = await repo.findAll()

    return members.map(toMemberResponse)
  }
