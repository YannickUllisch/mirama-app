// server/modules/account/teams/features/get-team/handler.ts
import { TeamRepository } from '@/server/modules/account/teams/infrastructure/team.repo'
import type { AppContext } from '@/server/shared/infrastructure/types'
import { toTeamDetailResponse } from '../response'

export const GetTeamQuery =
  ({ db }: AppContext) =>
  async (teamId: string) => {
    const repo = TeamRepository(db)
    const team = await repo.findById(teamId)

    if (!team) throw new Error('Team not found')

    return toTeamDetailResponse(team)
  }
