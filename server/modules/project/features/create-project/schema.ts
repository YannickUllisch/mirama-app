import { PriorityType, StatusType } from '@prisma/client'
import { z } from 'zod'

const ProjectMemberLinkSchema = z.object({
  memberId: z.string().min(1),
  isManager: z.boolean().default(false),
})

const NewMilestoneSchema = z.object({
  date: z.coerce.date(),
  title: z.string().min(4),
  colors: z.string(),
})

const NewTagSchema = z.object({
  title: z.string().min(2),
})

export const CreateProjectSchema = z
  .object({
    name: z.string().min(1, { message: 'Name cannot be empty.' }),
    description: z.string().nullable(),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    priority: z.nativeEnum(PriorityType).default(PriorityType.LOW),
    status: z.nativeEnum(StatusType).default(StatusType.ACTIVE),
    archived: z.boolean().default(false),
    budget: z.number().default(0),
    tags: z.string().array(),
    newTags: z.array(NewTagSchema),
    members: z.array(ProjectMemberLinkSchema),
    newMilestones: z.array(NewMilestoneSchema),
  })
  .refine((data) => data.startDate <= data.endDate, {
    message: 'Start Date must be before or equal to End Date',
    path: ['startDate'],
  })

export type CreateProjectRequest = z.infer<typeof CreateProjectSchema>
