// server/modules/account/teams/features/delete-team/handler.ts
//
// Deletion order matters:
//  1. Remove ProjectMember records inherited from this team (teamId FK is nullable
//     with SetNull default — we must delete these explicitly before the team goes).
//  2. Delete the team. Prisma cascades TeamMember rows automatically.
import database from '@db'
import { TeamRepository } from '@/server/modules/account/teams/infrastructure/team.repo'
import type { AppContext } from '@/server/shared/infrastructure/types'

export const DeleteTeamCommand =
  ({ db, logger }: AppContext) =>
  async (teamId: string) => {
    logger.info({ teamId }, 'Deleting team')

    const repo = TeamRepository(db)
    const team = await repo.findById(teamId)

    if (!team) throw new Error('Team not found')

    // Delete inherited ProjectMember records before the team's FK goes null
    await database.projectMember.deleteMany({
      where: { teamId, isInherited: true },
    })

    await repo.remove(teamId)
  }
