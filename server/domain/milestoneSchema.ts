import z from 'zod'

export const AttachMilestoneToProjectSchema = z.object({
  date: z.coerce.date({ message: 'Expected Milestone Date has to be defined' }),
  title: z
    .string()
    .min(4, { message: 'Title must be defined with at least 4 characters.' }),
  colors: z.string(),
})

export type AttachMilestoneToProjectInput = z.infer<
  typeof AttachMilestoneToProjectSchema
>
