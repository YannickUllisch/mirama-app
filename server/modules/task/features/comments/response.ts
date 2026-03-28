import type { Comment, Member } from '@prisma/client'

export type CommentResponse = {
  id: string
  content: string
  createdAt: Date
  parentId: string | null
  memberId: string
  memberName: string
}

type CommentWithMember = Comment & { member: Member }

export const toCommentResponse = (
  input: CommentWithMember,
): CommentResponse => ({
  id: input.id,
  content: input.content,
  createdAt: input.createdAt,
  parentId: input.parentId,
  memberId: input.memberId,
  memberName: input.member.name,
})
