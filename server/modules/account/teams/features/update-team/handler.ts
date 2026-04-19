// server/modules/account/teams/features/update-team/handler.ts
import { TeamEntity } from '@/server/modules/account/teams/domain/team.entity'
import { TeamRepository } from '@/server/modules/account/teams/infrastructure/team.repo'
import type { AppContext } from '@/server/shared/infrastructure/types'
import { toTeamResponse } from '../response'
import type { UpdateTeamRequest } from './schema'

export const UpdateTeamCommand =
  ({ db, logger }: AppContext) =>
  async (teamId: string, input: UpdateTeamRequest) => {
    logger.info({ teamId }, 'Updating team')

    const repo = TeamRepository(db)

    // Fetch with members so we know the current member count
    const team = await repo.findById(teamId)
    if (!team) throw new Error('Team not found')

    const updates: { name?: string; slug?: string } = {}

    if (input.name) {
      const slug = TeamEntity.createSlug(input.name)
      const slugConflict = await repo.findBySlug(slug)
      if (slugConflict && slugConflict.id !== teamId) {
        throw new Error('A team with this name already exists in the organization.')
      }
      updates.name = input.name
      updates.slug = slug
    }

    const updated = await repo.update(teamId, updates)

    return toTeamResponse(updated, team.members.length)
  }
