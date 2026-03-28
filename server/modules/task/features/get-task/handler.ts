import type { AppContext } from '@/server/shared/infrastructure/types'
import { TaskEntity } from '../../domain/task.entity'
import { TaskRepository } from '../../infrastructure/task.repo'
import { toTaskResponse } from '../response'

export const GetTaskQuery =
  ({ db, logger }: AppContext) =>
  async (taskId: string, sessionUserId: string, isAdminOrOwner: boolean) => {
    logger.info({ taskId }, 'Fetching task by ID')

    const repo = TaskRepository(db)
    const task = await repo.findById(taskId)
    if (!task) throw new Error('Task not found')

    // Permission: must be project member or admin/owner
    const project = await repo.findProjectMembers(task.projectId)
    if (!project) throw new Error('Project not found')

    TaskEntity.assertProjectMemberOrAdmin(
      project.members.map((m) => m.memberId),
      sessionUserId,
      isAdminOrOwner,
    )

    return toTaskResponse(task)
  }
