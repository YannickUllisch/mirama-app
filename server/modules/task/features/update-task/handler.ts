import type { AppContext } from '@/server/shared/infrastructure/types'
import { TaskEntity } from '../../domain/task.entity'
import { TaskRepository } from '../../infrastructure/task.repo'
import { toTaskResponse } from '../response'
import type { UpdateTaskRequest } from './schema'

export const UpdateTaskCommand =
  ({ db, logger }: AppContext) =>
  async (
    taskId: string,
    sessionUserId: string,
    isAdminOrOwner: boolean,
    input: UpdateTaskRequest,
  ) => {
    logger.info({ taskId }, 'Updating task')

    const { tags, newTags, subtasks, parentId, ...rest } = input

    TaskEntity.assertNotContainerWithParent(rest.type, parentId)

    const repo = TaskRepository(db)

    // Verify task exists
    const existing = await repo.findById(taskId)
    if (!existing) throw new Error('Task not found')

    // Permission check via project membership
    const project = await repo.findProjectMembers(existing.projectId)
    if (!project) throw new Error('Project not found')

    TaskEntity.assertProjectMemberOrAdmin(
      project.members.map((m) => m.memberId),
      sessionUserId,
      isAdminOrOwner,
    )

    const task = await repo.update(taskId, {
      ...rest,
      parentId,
      tags: {
        set: tags.map((id: string) => ({ id })),
        create: newTags.map((t: { title: string }) => ({ title: t.title })),
      },
      subtasks: {
        set: subtasks.map((id: string) => ({ id })),
      },
    })

    return toTaskResponse(task)
  }
