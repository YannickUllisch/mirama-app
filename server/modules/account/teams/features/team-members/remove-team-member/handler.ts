// server/modules/account/teams/features/team-members/remove-team-member/handler.ts
//
// Removes the member from the team and cleans up any ProjectMember records
// that were inherited from this team assignment.
import database from '@db'
import { TeamRepository } from '@/server/modules/account/teams/infrastructure/team.repo'
import { TeamMemberRepository } from '@/server/modules/account/teams/infrastructure/team-member.repo'
import type { AppContext } from '@/server/shared/infrastructure/types'

export const RemoveTeamMemberCommand =
  ({ db, logger }: AppContext) =>
  async (teamId: string, memberId: string) => {
    logger.info({ teamId, memberId }, 'Removing member from team')

    // Verify team is within this org (ScopedDb enforces org scope)
    const team = await TeamRepository(db).findById(teamId)
    if (!team) throw new Error('Team not found')

    const memberRepo = TeamMemberRepository(db)
    const existing = await memberRepo.findOne(teamId, memberId)
    if (!existing) throw new Error('Member is not in this team')

    // Remove inherited ProjectMember records before unlinking from the team
    await database.projectMember.deleteMany({
      where: { memberId, teamId, isInherited: true },
    })

    await memberRepo.remove(teamId, memberId)
  }
