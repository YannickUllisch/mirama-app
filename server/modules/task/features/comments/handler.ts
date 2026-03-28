import type { AppContext } from '@/server/shared/infrastructure/types'
import { TaskEntity } from '../../domain/task.entity'
import { TaskRepository } from '../../infrastructure/task.repo'
import { CommentRepository } from './comment.repo'
import { toCommentResponse } from './response'
import type { CreateCommentRequest, UpdateCommentRequest } from './schema'

export const GetCommentsQuery =
  ({ db, logger }: AppContext) =>
  async (taskId: string, sessionUserId: string, isAdminOrOwner: boolean) => {
    logger.info({ taskId }, 'Fetching comments for task')

    const taskRepo = TaskRepository(db)
    const task = await taskRepo.findById(taskId)
    if (!task) throw new Error('Task not found')

    // Permission: project member or admin
    const project = await taskRepo.findProjectMembers(task.projectId)
    if (!project) throw new Error('Project not found')

    TaskEntity.assertProjectMemberOrAdmin(
      project.members.map((m) => m.memberId),
      sessionUserId,
      isAdminOrOwner,
    )

    const repo = CommentRepository(db)
    const comments = await repo.findByTaskId(taskId)

    return comments.map(toCommentResponse)
  }

export const CreateCommentCommand =
  ({ db, logger }: AppContext) =>
  async (taskId: string, input: CreateCommentRequest) => {
    logger.info({ taskId }, 'Creating comment')

    const repo = CommentRepository(db)
    const comment = await repo.create({
      content: input.content,
      taskId,
      parentId: input.parentId,
      memberId: input.memberId,
    })

    return toCommentResponse(comment)
  }

export const UpdateCommentCommand =
  ({ db, logger }: AppContext) =>
  async (
    commentId: string,
    sessionUserId: string,
    input: UpdateCommentRequest,
  ) => {
    logger.info({ commentId }, 'Updating comment')

    const repo = CommentRepository(db)

    // Only comment author can update (Prisma where clause enforces memberId)
    const comment = await repo.update(commentId, sessionUserId, {
      content: input.content,
    })

    return toCommentResponse(comment)
  }

export const DeleteCommentCommand =
  ({ db, logger }: AppContext) =>
  async (commentId: string, sessionUserId: string, isAdminOrOwner: boolean) => {
    logger.info({ commentId }, 'Deleting comment')

    const repo = CommentRepository(db)
    const comment = await repo.findById(commentId)

    if (!comment) throw new Error('Comment not found')

    // Only author or admin can delete
    if (comment.memberId !== sessionUserId && !isAdminOrOwner) {
      throw new Error('Insufficient permission')
    }

    await repo.remove(commentId)
  }
