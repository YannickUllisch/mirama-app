import z from 'zod'

export const AttachMilestoneToProjectSchema = z.object({
  date: z.date({ message: 'Expected Milestone Date has to be defined' }),
  title: z
    .string()
    .min(4, { message: 'Title must be defined with at least 4 characters.' }),
  color: z.string().optional(),
})

export type AttachMilestoneToProjectInput = z.infer<
  typeof AttachMilestoneToProjectSchema
>
