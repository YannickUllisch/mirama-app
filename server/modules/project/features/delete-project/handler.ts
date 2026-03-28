import type { AppContext } from '@/server/shared/infrastructure/types'
import { ProjectRepository } from '../../infrastructure/project.repo'

export const DeleteProjectCommand =
  ({ db, logger }: AppContext) =>
  async (projectId: string) => {
    logger.info({ projectId }, 'Deleting project')

    const repo = ProjectRepository(db)
    await repo.remove(projectId)
  }
