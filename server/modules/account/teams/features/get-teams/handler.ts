// server/modules/account/teams/features/get-teams/handler.ts
import { TeamRepository } from '@/server/modules/account/teams/infrastructure/team.repo'
import type { AppContext } from '@/server/shared/infrastructure/types'
import { toTeamResponse } from '../response'

export const GetTeamsQuery =
  ({ db }: AppContext) =>
  async () => {
    const repo = TeamRepository(db)
    const teams = await repo.findAll()

    return teams.map((t) => toTeamResponse(t, t._count.members))
  }
