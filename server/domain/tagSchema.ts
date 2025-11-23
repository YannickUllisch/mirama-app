import z from 'zod'

export const TagResponseSchema = z.object({
  id: z.string(),
  title: z.string(),
})

export const UpdateTagSchema = z.object({
  title: z
    .string()
    .min(1, { message: 'Title has to consist of at least 1 character' }),
})

export const DeleteTagsSchema = z.array(
  z.string().min(1, 'Array of atleast one ID is required'),
)

export const CreateTagSchema = z.object({
  title: z
    .string()
    .min(2, { message: 'Tag title must be at least 2 characters.' }),
})

export type TagResponseType = z.infer<typeof TagResponseSchema>
export type CreateTagType = z.infer<typeof CreateTagSchema>
export type UpdateTagType = z.infer<typeof UpdateTagSchema>
export type DeleteTagsType = z.infer<typeof DeleteTagsSchema>
