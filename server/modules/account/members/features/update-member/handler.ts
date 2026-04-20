import type { AppContext } from '@/server/shared/infrastructure/types'
import { MemberRepository } from '../../infrastructure/member.repo'
import type { UpdateMemberRequest } from './schema'

export const UpdateMemberCommand =
  ({ db, logger }: AppContext) =>
  async (memberId: string, input: UpdateMemberRequest) => {
    logger.info({ memberId }, 'Updating member')

    const repo = MemberRepository(db)
    const member = await repo.findById(memberId)

    if (!member) throw new Error('Member not found')

    return await repo.update(memberId, {
      ...(input.name && { name: input.name }),
      ...(input.email && { email: input.email }),
      ...(input.iamRoleId && { iamRoleId: input.iamRoleId }),
    })
  }
