import type { AppContext } from '@/server/shared/infrastructure/types'
import { TaskEntity } from '../../domain/task.entity'
import { TaskRepository } from '../../infrastructure/task.repo'

export const DeleteTaskCommand =
  ({ db, logger }: AppContext) =>
  async (taskId: string, sessionUserId: string, isAdminOrOwner: boolean) => {
    logger.info({ taskId }, 'Deleting task')

    const repo = TaskRepository(db)

    const existing = await repo.findById(taskId)
    if (!existing) throw new Error('Task not found')

    const project = await repo.findProjectMembers(existing.projectId)
    if (!project) throw new Error('Project not found')

    TaskEntity.assertProjectMemberOrAdmin(
      project.members.map((m) => m.memberId),
      sessionUserId,
      isAdminOrOwner,
    )

    await repo.remove(taskId)
  }

export const DeleteTasksBulkCommand =
  ({ db, logger }: AppContext) =>
  async (
    ids: string[],
    projectId: string,
    sessionUserId: string,
    isAdminOrOwner: boolean,
  ) => {
    logger.info({ count: ids.length, projectId }, 'Deleting tasks in bulk')

    const repo = TaskRepository(db)

    const project = await repo.findProjectMembers(projectId)
    if (!project) throw new Error('Project not found')

    TaskEntity.assertProjectMemberOrAdmin(
      project.members.map((m) => m.memberId),
      sessionUserId,
      isAdminOrOwner,
    )

    await repo.removeBulk(ids)
  }
