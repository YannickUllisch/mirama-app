import { z } from 'zod'

export const CreateTagSchema = z.object({
  title: z
    .string()
    .min(2, { message: 'Tag title must be at least 2 characters' }),
})

export type CreateTagRequest = z.infer<typeof CreateTagSchema>
