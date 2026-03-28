import type { AppContext } from '@/server/shared/infrastructure/types'
import { ProjectRepository } from '../../infrastructure/project.repo'

export const GetAssigneesQuery =
  ({ db, logger }: AppContext) =>
  async (projectId: string, sessionUserId: string, isAdminOrOwner: boolean) => {
    logger.info({ projectId }, 'Fetching project assignees')

    const repo = ProjectRepository(db)

    // Permission check: must be project member or admin/owner
    const project = await repo.findProjectMembers(projectId)
    if (!project) throw new Error('Project not found')

    const isMember = project.members.some((m) => m.memberId === sessionUserId)
    if (!isMember && !isAdminOrOwner) throw new Error('Insufficient permission')

    return await repo.getAssignees(projectId)
  }
