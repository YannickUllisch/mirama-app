import type { AppContext } from '@/server/shared/infrastructure/types'
import type { OrganizationRole } from '@prisma/client'
import { MemberEntity } from '../../domain/member.entity'
import { MemberRepository } from '../../infrastructure/member.repo'
import type { UpdateMemberRequest } from './schema'

export const UpdateMemberCommand =
  ({ db, logger }: AppContext) =>
  async (
    memberId: string,
    sessionRole: OrganizationRole,
    input: UpdateMemberRequest,
  ) => {
    logger.info({ memberId }, 'Updating member')

    const repo = MemberRepository(db)
    const member = await repo.findById(memberId)

    if (!member) throw new Error('Member not found')

    MemberEntity.assertCanManage(member.role, sessionRole)

    if (input.organizationRole) {
      MemberEntity.assertCanManage(input.organizationRole, sessionRole)
    }

    return await repo.update(memberId, {
      ...(input.name && { name: input.name }),
      ...(input.email && { email: input.email }),
      ...(input.organizationRole && { role: input.organizationRole }),
    })
  }
