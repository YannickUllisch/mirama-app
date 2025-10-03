import { PriorityType, StatusType } from '@prisma/client'
import z from 'zod'
import { AttachMilestoneToProjectSchema } from './milestoneSchema'

export const PriorityTypeSchema = z.nativeEnum(PriorityType)
export const StatusTypeSchema = z.nativeEnum(StatusType)

export const ProjectUserLinkSchema = z.object({
  userId: z.string().min(1, { message: 'User ID must be defined' }),
  isManager: z.boolean().default(false),
})

export const CreateProjectSchema = z
  .object({
    name: z.string().min(1, { message: 'Name cannot be empty.' }),
    description: z.string().optional(),
    startDate: z.coerce.date({ message: 'Start Date has to be defined' }),
    endDate: z.coerce.date({ message: 'End Date has to be defined' }),
    priority: PriorityTypeSchema.default('LOW'),
    status: StatusTypeSchema.default('ACTIVE'),
    budget: z.number().default(0),
    tags: z.string().array(),
    users: z.array(ProjectUserLinkSchema),
    milestones: z.array(AttachMilestoneToProjectSchema),
  })
  .refine((data) => data.startDate <= data.endDate, {
    message: 'Start Date must be before or equal to End Date',
    path: ['startDate'],
  })

export const UpdateProjectSchema = z
  .object({
    name: z.string().min(1, { message: 'Name cannot be empty.' }),
    description: z.string().optional(),
    startDate: z.date({ message: 'Start Date has to be defined' }),
    endDate: z.date({ message: 'End Date has to be defined' }),
    priority: PriorityTypeSchema,
    status: StatusTypeSchema,
    budget: z.number(),
    tags: z.string().array(), // TODO: Switch with TagResponse type
    users: z.array(ProjectUserLinkSchema),
    milestones: z.array(AttachMilestoneToProjectSchema),
  })
  .refine((data) => data.startDate <= data.endDate, {
    message: 'Start Date must be before or equal to End Date',
    path: ['startDate'],
  })

export type PriorityTypeInput = z.infer<typeof PriorityTypeSchema>
export type StatusTypeInput = z.infer<typeof StatusTypeSchema>
export type CreateProjectInput = z.infer<typeof CreateProjectSchema>
