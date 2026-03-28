import type { AppContext } from '@/server/shared/infrastructure/types'
import { ProjectRepository } from '../../infrastructure/project.repo'
import { toProjectResponse } from '../response'

export const GetProjectsQuery =
  ({ db, logger }: AppContext) =>
  async (sessionUserId: string, isAdminOrOwner: boolean, archived: boolean) => {
    logger.info({ archived }, 'Fetching projects')

    const repo = ProjectRepository(db)
    const projects = await repo.findAll({
      sessionUserId,
      archived,
      isAdminOrOwner,
    })

    return projects.map(toProjectResponse)
  }
