import type { Comment, Member } from '@prisma/client'
import type { CommentResponseType } from '@server/domain/commentSchema'

export const CommentMapper = {
  mapDefaultToApi: (
    input: Comment & { member: Member },
  ): CommentResponseType => {
    return {
      id: input.id,
      content: input.content,
      createdAt: input.createdAt,
      parentId: input.parentId,
      memberId: input.memberId,
      memberName: input.member.name,
    }
  },
}
