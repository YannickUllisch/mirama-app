import z from 'zod'

export const CommentResponseSchema = z.object({
  id: z.string(),
  content: z.string().min(1, { message: 'Comment content cannot be empty.' }),

  createdAt: z.date(),
  userId: z.string(),
  userName: z.string(),

  parentId: z.string().nullable(),
})

export const CreateCommentSchema = z.object({
  content: z.string().min(1, { message: 'Comment content cannot be empty.' }),
  taskId: z.string(),
  parentId: z.string().nullable(),
  userId: z.string(),
})

export const UpdateCommentSchema = z.object({
  content: z.string().min(1).optional(),
})

export type CreateCommentType = z.infer<typeof CreateCommentSchema>
export type CommentResponseType = z.infer<typeof CommentResponseSchema>
export type UpdateCommentType = z.infer<typeof UpdateCommentSchema>
