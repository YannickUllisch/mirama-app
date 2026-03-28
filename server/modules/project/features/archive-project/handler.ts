import type { AppContext } from '@/server/shared/infrastructure/types'
import { ProjectRepository } from '../../infrastructure/project.repo'
import { toProjectResponse } from '../response'
import type { ArchiveProjectRequest } from './schema'

export const ArchiveProjectCommand =
  ({ db, logger }: AppContext) =>
  async (projectId: string, input: ArchiveProjectRequest) => {
    logger.info(
      { projectId, archived: input.archived },
      'Setting project archive status',
    )

    const repo = ProjectRepository(db)
    const project = await repo.setArchived(projectId, input.archived)

    return toProjectResponse(project)
  }
