import type { AppContext } from '@/server/shared/infrastructure/types'
import { ProjectRepository } from '../../infrastructure/project.repo'
import { toProjectResponse } from '../response'

export const GetProjectsQuery =
  ({ db, logger }: AppContext) =>
  async (memberId: string, archived: boolean) => {
    const repo = ProjectRepository(db)
    const projects = await repo.findAll({
      memberId,
      archived,
    })

    logger.info(`got projects of count ${projects.length}`)

    return projects.map(toProjectResponse)
  }
