// server/modules/account/teams/features/team-members/get-team-members/handler.ts
import { TeamMemberRepository } from '@/server/modules/account/teams/infrastructure/team-member.repo'
import { TeamRepository } from '@/server/modules/account/teams/infrastructure/team.repo'
import type { AppContext } from '@/server/shared/infrastructure/types'
import { toTeamMemberResponse } from '../../response'

export const GetTeamMembersQuery =
  ({ db }: AppContext) =>
  async (teamId: string) => {
    // Verify the team exists and belongs to this org (ScopedDb enforces org scope)
    const team = await TeamRepository(db).findById(teamId)
    if (!team) throw new Error('Team not found')

    const members = await TeamMemberRepository(db).findByTeam(teamId)

    return members.map(toTeamMemberResponse)
  }
