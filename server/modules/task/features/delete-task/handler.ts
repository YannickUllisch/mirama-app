import type { AppContext } from '@/server/shared/infrastructure/types'
import { TaskEntity } from '../../domain/task.entity'
import { TaskRepository } from '../../infrastructure/task.repo'

export const DeleteTaskCommand =
  ({ db }: AppContext) =>
  async (taskId: string, sessionUserId: string) => {
    const repo = TaskRepository(db)

    const existing = await repo.findById(taskId)
    if (!existing) throw new Error('Task not found')

    const project = await repo.findProjectMembers(existing.projectId)
    if (!project) throw new Error('Project not found')

    TaskEntity.assertProjectMemberOrAdmin(
      project.members.map((m) => m.memberId),
      sessionUserId,
    )

    await repo.remove(taskId)
  }

export const DeleteTasksBulkCommand =
  ({ db, logger }: AppContext) =>
  async (ids: string[], projectId: string, sessionUserId: string) => {
    logger.info({ count: ids.length, projectId }, 'Deleting tasks in bulk')

    const repo = TaskRepository(db)

    const project = await repo.findProjectMembers(projectId)
    if (!project) throw new Error('Project not found')

    TaskEntity.assertProjectMemberOrAdmin(
      project.members.map((m) => m.memberId),
      sessionUserId,
    )

    await repo.removeBulk(ids)
  }
