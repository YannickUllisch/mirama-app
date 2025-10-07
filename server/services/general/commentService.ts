import type {
  CreateCommentType,
  UpdateCommentType,
} from '@server/domain/commentSchema'
import { CommentMapper } from '@server/mapping/general/commentMapper'
import db from '@server/utils/db'

const getCommentsByTaskId = async (
  taskId: string,
  sessionUserId: string,
  isAdminOrOwner: boolean,
) => {
  // Access validation
  const task = await db.task.findFirst({
    where: {
      id: taskId,
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
}

const createComment = async (input: CreateCommentType) => {
  const comment = await db.comment.create({
    data: { ...input },
    include: {
      user: true,
    },
  })
  return CommentMapper.mapDefaultToApi(comment)
}

const updateComment = async (commentId: string, input: UpdateCommentType) => {
  const comment = await db.comment.update({
    where: {
      id: commentId,
    },
    data: { ...input },
    include: {
      user: true,
    },
  })
  return CommentMapper.mapDefaultToApi(comment)
}

const deleteComment = async (commentId: string, sessionUserId: string) => {
  await db.comment.delete({
    where: { id: commentId, userId: sessionUserId },
  })
}

export const CommentService = {
  getCommentsByTaskId,
  createComment,
  updateComment,
  deleteComment,
}
