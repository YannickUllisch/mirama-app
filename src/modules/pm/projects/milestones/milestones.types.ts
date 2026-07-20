// src/modules/pm/projects/milestones/milestones.types.ts
import { z } from 'zod'

export const ProjectMilestoneResponseSchema = z.object({
  id: z.uuid(),
  title: z.string(),
  description: z.string().nullable().optional(),
  dueDate: z.string(),
  status: z.string(),
  color: z.string().nullable().optional(),
  dateCreated: z.string(),
})

export const CreateProjectMilestoneInputSchema = z.object({
  title: z.string().min(1),
  dueDate: z.string(),
  description: z.string().nullable().optional(),
  color: z.string().nullable().optional(),
})

export const CreateProjectMilestoneCommandSchema = z.object({
  title: z.string().min(1),
  dueDate: z.string(),
  description: z.string().nullable().optional(),
  color: z.string().nullable().optional(),
})

export const UpdateProjectMilestoneCommandSchema = z.object({
  title: z.string().min(1),
  dueDate: z.string(),
  description: z.string().nullable().optional(),
  color: z.string().nullable().optional(),
})

export type ProjectMilestoneResponse = z.infer<
  typeof ProjectMilestoneResponseSchema
>
export type CreateProjectMilestoneInput = z.infer<
  typeof CreateProjectMilestoneInputSchema
>
export type CreateProjectMilestoneCommand = z.infer<
  typeof CreateProjectMilestoneCommandSchema
>
export type UpdateProjectMilestoneCommand = z.infer<
  typeof UpdateProjectMilestoneCommandSchema
>
