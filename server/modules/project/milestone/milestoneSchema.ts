import z from 'zod'

export const AttachNewMilestoneToProjectSchema = z.object({
  date: z.coerce.date({ message: 'Expected Milestone Date has to be defined' }),
  title: z
    .string()
    .min(4, { message: 'Title must be defined with at least 4 characters.' }),
  colors: z.string(),
})

export const MilestoneProjectResponseSchema = z.object({
  id: z.string(),
  date: z.coerce.date({ message: 'Expected Milestone Date has to be defined' }),
  title: z
    .string()
    .min(4, { message: 'Title must be defined with at least 4 characters.' }),
  colors: z.string(),
})

// TMP
export const MilestoneSchema = z.object({
  id: z.string(),
  date: z.date(),
  title: z.string(),
  colors: z.string(),
  projectId: z.string(),
})

export type AttachNewMilestoneToProjectInput = z.infer<
  typeof AttachNewMilestoneToProjectSchema
>

export type MilestoneProjectResponseInput = z.infer<
  typeof MilestoneProjectResponseSchema
>
