import type { Comment, User } from '@prisma/client'
import type { CommentResponseType } from '@server/domain/commentSchema'

export const CommentMapper = {
  mapDefaultToApi: (input: Comment & { user: User }): CommentResponseType => {
    return {
      content: input.content,
      createdAt: input.createdAt,
      id: input.id,
      parentId: input.parentId,
      userId: input.userId,
      userName: input.user.name,
    }
  },
}
