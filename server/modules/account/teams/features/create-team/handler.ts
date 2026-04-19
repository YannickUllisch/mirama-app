// server/modules/account/teams/features/create-team/handler.ts
import { TeamEntity } from '@/server/modules/account/teams/domain/team.entity'
import { TeamRepository } from '@/server/modules/account/teams/infrastructure/team.repo'
import type { AppContext } from '@/server/shared/infrastructure/types'
import { toTeamResponse } from '../response'
import type { CreateTeamRequest } from './schema'

export const CreateTeamCommand =
  ({ db, logger }: AppContext) =>
  async (input: CreateTeamRequest) => {
    logger.info({ name: input.name }, 'Creating team')

    const slug = TeamEntity.createSlug(input.name)
    const repo = TeamRepository(db)

    const existing = await repo.findBySlug(slug)
    if (existing) {
      throw new Error('A team with this name already exists in the organization.')
    }

    const team = await repo.create({ name: input.name, slug })

    // New team always starts with 0 members
    return toTeamResponse(team, 0)
  }
