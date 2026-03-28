import { z } from 'zod'

export const UpdateTagSchema = z.object({
  title: z.string().min(1, { message: 'Title must be at least 1 character' }),
})

export const TagIdParams = z.object({
  id: z.string().min(1),
})

export type UpdateTagRequest = z.infer<typeof UpdateTagSchema>
export type TagIdRequest = z.infer<typeof TagIdParams>
