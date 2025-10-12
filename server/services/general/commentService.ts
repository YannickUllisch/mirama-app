import type {
  CreateCommentType,
  UpdateCommentType,
} from '@server/domain/commentSchema'
import { CommentMapper } from '@server/mapping/general/commentMapper'
import db from '@server/utils/db'

export const CommentService = {
  getCommentsByTaskId: async (
    taskId: string,
    projectId: string,
    sessionUserId: string,
    isAdminOrOwner: boolean,
  ) => {
    // Access validation
    const task = await db.task.findFirst({
      where: {
        id: taskId,
        projectId,
      },
      select: {
        project: {
          select: {
            users: {
              select: {
                userId: true,
              },
            },
          },
        },
      },
    })

    if (!task) throw new Error('Task not found')

    if (
      !task.project.users.map((u) => u.userId).includes(sessionUserId) &&
      !isAdminOrOwner
    ) {
      throw new Error('Invalid permission')
    }

    const res = await db.comment.findMany({
      where: { taskId },
      include: {
        user: true,
      },
    })
    return res.map((r) => CommentMapper.mapDefaultToApi(r))
  },

  createComment: async (taskId: string, input: CreateCommentType) => {
    const comment = await db.comment.create({
      data: { ...input, taskId },
      include: {
        user: true,
      },
    })
    return CommentMapper.mapDefaultToApi(comment)
  },

  updateComment: async (
    commentId: string,
    taskId: string,
    projectId: string,
    sessionUserId: string,
    input: UpdateCommentType,
  ) => {
    const val = await db.comment.findFirst({
      where: {
        id: commentId,
        userId: sessionUserId,
        taskId,
        task: {
          projectId,
        },
      },
      select: {
        id: true,
      },
    })

    if (!val) throw new Error('Invalid Permission')

    const comment = await db.comment.update({
      where: {
        id: commentId,
        userId: sessionUserId,
        taskId,
      },
      data: { ...input },
      include: {
        user: true,
      },
    })
    return CommentMapper.mapDefaultToApi(comment)
  },

  deleteComment: async (
    commentId: string,
    taskId: string,
    projectId: string,
    sessionUserId: string,
    isAdminOrOwner: boolean,
  ) => {
    const val = await db.comment.findFirst({
      where: {
        id: commentId,
        userId: sessionUserId,
        taskId,
        task: {
          projectId,
        },
      },
      select: {
        id: true,
      },
    })

    if (!val && !isAdminOrOwner) throw new Error('Invalid Permission')

    await db.comment.delete({
      where: { id: commentId, userId: sessionUserId },
    })
  },
}
