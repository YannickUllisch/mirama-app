// server/modules/account/teams/features/team-members/add-team-member/handler.ts
import { TeamMemberRepository } from '@/server/modules/account/teams/infrastructure/team-member.repo'
import { TeamRepository } from '@/server/modules/account/teams/infrastructure/team.repo'
import type { AppContext } from '@/server/shared/infrastructure/types'
import { toTeamMemberResponse } from '../../response'
import type { AddTeamMemberRequest } from './schema'

export const AddTeamMemberCommand =
  ({ db }: AppContext) =>
  async (teamId: string, input: AddTeamMemberRequest) => {
    const teamRepo = TeamRepository(db)

    // Verify team is within this org (ScopedDb enforces org scope)
    const team = await teamRepo.findById(teamId)
    if (!team) throw new Error('Team not found')

    // Verify the member belongs to the same org (ScopedDb enforces org scope)
    const member = await db.member.findFirst({ where: { id: input.memberId } })
    if (!member) throw new Error('Member not found in this organization')

    const memberRepo = TeamMemberRepository(db)

    const existing = await memberRepo.findOne(teamId, input.memberId)
    if (existing) throw new Error('Member is already in this team')

    const teamMember = await memberRepo.create(teamId, input.memberId)

    return toTeamMemberResponse(teamMember)
  }
