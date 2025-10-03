import { PriorityType, StatusType } from '@prisma/client'
import z from 'zod'
import { PriorityTypeSchema, StatusTypeSchema } from './enumSchemas'
import {
  AttachNewMilestoneToProjectSchema,
  MilestoneProjectResponseSchema,
} from './milestoneSchema'
import { CreateTagSchema, TagResponse } from './tagSchema'
import { TaskProjectResponseSchema } from './taskSchema'
import { UserProjectResponseSchema } from './userSchema'

export const ProjectUserLinkSchema = z.object({
  userId: z.string().min(1, { message: 'User ID must be defined' }),
  isManager: z.boolean().default(false),
})

export const ProjectResponseSchema = z
  .object({
    id: z.string(),
    name: z.string().min(1, { message: 'Name cannot be empty.' }),
    description: z.string().nullable(),
    startDate: z.coerce.date({ message: 'Start Date has to be defined' }),
    endDate: z.coerce.date({ message: 'End Date has to be defined' }),
    priority: PriorityTypeSchema.default('LOW'),
    archived: z.boolean(),
    status: StatusTypeSchema.default('ACTIVE'),
    budget: z.number().default(0),
    milestones: z.array(MilestoneProjectResponseSchema),
    tags: z.array(TagResponse),
    users: z.array(UserProjectResponseSchema),
    tasks: z.array(TaskProjectResponseSchema),
  })
  .refine((data) => data.startDate <= data.endDate, {
    message: 'Start Date must be before or equal to End Date',
    path: ['startDate'],
  })

export const CreateProjectSchema = z
  .object({
    name: z.string().min(1, { message: 'Name cannot be empty.' }),
    description: z.string().nullable(),
    startDate: z.coerce.date({ message: 'Start Date has to be defined' }),
    endDate: z.coerce.date({ message: 'End Date has to be defined' }),
    priority: PriorityTypeSchema.default('LOW'),
    status: StatusTypeSchema.default('ACTIVE'),
    budget: z.number().default(0),
    tags: z.string().array(),
    newTags: z.array(CreateTagSchema),
    users: z.array(ProjectUserLinkSchema),
    newMilestones: z.array(AttachNewMilestoneToProjectSchema),
  })
  .refine((data) => data.startDate <= data.endDate, {
    message: 'Start Date must be before or equal to End Date',
    path: ['startDate'],
  })

export const UpdateProjectSchema = z
  .object({
    name: z.string().min(1, { message: 'Name cannot be empty.' }),
    description: z.string().nullable(),
    startDate: z.coerce.date({ message: 'Start Date has to be defined' }),
    endDate: z.coerce.date({ message: 'End Date has to be defined' }),
    priority: z.nativeEnum(PriorityType),
    status: z.nativeEnum(StatusType),
    budget: z.number(),
    tags: z.string().array(),
    users: z.array(ProjectUserLinkSchema),
    milestones: z.array(MilestoneProjectResponseSchema),
  })
  .refine((data) => data.startDate <= data.endDate, {
    message: 'Start Date must be before or equal to End Date',
    path: ['startDate'],
  })

export type CreateProjectInput = z.infer<typeof CreateProjectSchema>
export type UpdateProjectInput = z.infer<typeof UpdateProjectSchema>
export type ProjectResponseInput = z.infer<typeof ProjectResponseSchema>
