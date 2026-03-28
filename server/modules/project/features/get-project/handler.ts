import type { AppContext } from '@/server/shared/infrastructure/types'
import { ProjectRepository } from '../../infrastructure/project.repo'
import { toProjectResponse } from '../response'

export const GetProjectQuery =
  ({ db, logger }: AppContext) =>
  async (projectId: string, sessionUserId: string, isAdminOrOwner: boolean) => {
    logger.info({ projectId }, 'Fetching project by ID')

    const repo = ProjectRepository(db)
    const project = await repo.findById(projectId)

    if (!project) throw new Error('Project not found')

    const isMember = project.members.some((m) => m.memberId === sessionUserId)
    if (!isMember && !isAdminOrOwner) throw new Error('Insufficient permission')

    return toProjectResponse(project)
  }
