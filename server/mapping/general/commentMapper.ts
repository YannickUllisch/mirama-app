import type { User } from '@/prisma/zod'
import type { Comment } from '@prisma/client'
import type { CommentResponseType } from '@server/domain/commentSchema'

const mapDefaultToApi = (
  input: Comment & { user: User },
): CommentResponseType => {
  return {
    content: input.content,
    createdAt: input.createdAt,
    id: input.id,
    parentId: input.parentId,
    userId: input.userId,
    userName: input.user.name,
  }
}

export const CommentMapper = {
  mapDefaultToApi,
}
