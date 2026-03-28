import type { AppContext } from '@/server/shared/infrastructure/types'
import { generateTaskId } from '@/src/lib/helpers/TaskCodeGenerator'
import { randomUUID } from 'node:crypto'
import { TaskEntity } from '../../domain/task.entity'
import { TaskRepository } from '../../infrastructure/task.repo'
import { toTaskResponse } from '../response'
import type { CreateTaskRequest } from './schema'

export const CreateTaskCommand =
  ({ db, logger }: AppContext) =>
  async (
    sessionUserId: string,
    isAdminOrOwner: boolean,
    input: CreateTaskRequest,
  ) => {
    logger.info(
      { projectId: input.projectId, title: input.title },
      'Creating task',
    )

    const { tags, newTags, subtasks, parentId, ...rest } = input

    TaskEntity.assertNotContainerWithParent(rest.type, parentId)

    const repo = TaskRepository(db)

    // Verify project exists and check permissions
    const project = await repo.findProjectMembers(input.projectId)
    if (!project) throw new Error('Project not found')

    TaskEntity.assertProjectMemberOrAdmin(
      project.members.map((m) => m.memberId),
      sessionUserId,
      isAdminOrOwner,
    )

    const newTaskId = randomUUID()
    const task = await repo.create({
      ...rest,
      id: newTaskId,
      taskCode: generateTaskId(project.name, newTaskId),
      parentId,
      tags: {
        connect: tags.map((id) => ({ id })),
        create: newTags.map((t) => ({ title: t.title })),
      },
      subtasks: {
        connect: subtasks.map((id) => ({ id })),
      },
    })

    return toTaskResponse(task)
  }
