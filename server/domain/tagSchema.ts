import z from 'zod'

export const CreateTagSchema = z.object({
  title: z
    .string()
    .min(1, { message: 'Title has to consist of at least 1 character' }),
})

export const UpdateTagSchema = z.object({
  title: z
    .string()
    .min(1, { message: 'Title has to consist of at least 1 character' }),
})

export const DeleteTagsSchema = z.array(
  z.string().min(1, 'Array of atleast one ID is required'),
)

export type CreateTagInput = z.infer<typeof CreateTagSchema>
export type UpdateTagInput = z.infer<typeof UpdateTagSchema>
export type DeleteTagsInput = z.infer<typeof DeleteTagsSchema>
