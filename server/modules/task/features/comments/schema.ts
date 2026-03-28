import { z } from 'zod'

export const CommentIdParams = z.object({
  taskId: z.string().min(1),
  commentId: z.string().min(1),
})

export const CreateCommentSchema = z.object({
  content: z.string().min(1, { message: 'Comment content cannot be empty.' }),
  parentId: z.string().nullable(),
  memberId: z.string().min(1),
})

export const UpdateCommentSchema = z.object({
  content: z.string().min(1),
})

export type CommentIdRequest = z.infer<typeof CommentIdParams>
export type CreateCommentRequest = z.infer<typeof CreateCommentSchema>
export type UpdateCommentRequest = z.infer<typeof UpdateCommentSchema>
