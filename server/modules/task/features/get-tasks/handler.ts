import type { AppContext } from '@/server/shared/infrastructure/types'
import { TaskEntity } from '../../domain/task.entity'
import { TaskRepository } from '../../infrastructure/task.repo'
import { toTaskResponse } from '../response'

export const GetTasksByProjectQuery =
  ({ db, logger }: AppContext) =>
  async (
    projectId: string,
    sessionUserId: string,
    isAdminOrOwner: boolean,
    ignoreCompleted: boolean,
  ) => {
    logger.info({ projectId, ignoreCompleted }, 'Fetching tasks by project')

    const repo = TaskRepository(db)

    // Permission: must be project member or admin/owner
    const project = await repo.findProjectMembers(projectId)
    if (!project) throw new Error('Project not found')

    TaskEntity.assertProjectMemberOrAdmin(
      project.members.map((m) => m.memberId),
      sessionUserId,
      isAdminOrOwner,
    )

    const tasks = await repo.findByProject({ projectId, ignoreCompleted })
    return tasks.map(toTaskResponse)
  }

export const GetPersonalTasksQuery =
  ({ db, logger }: AppContext) =>
  async (sessionUserId: string, projectId?: string) => {
    logger.info({ projectId }, 'Fetching personal tasks')

    const repo = TaskRepository(db)
    const tasks = await repo.findPersonal({
      assignedToId: sessionUserId,
      projectId,
    })

    return tasks.map(toTaskResponse)
  }
