import { PriorityType, StatusType } from '@prisma/client'
import { z } from 'zod'

const ProjectMemberLinkSchema = z.object({
  memberId: z.string().min(1),
  isManager: z.boolean().default(false),
})

const MilestoneSchema = z.object({
  id: z.string().optional(),
  date: z.coerce.date(),
  title: z.string().min(4),
  colors: z.string(),
})

const NewTagSchema = z.object({
  title: z.string().min(2),
})

export const UpdateProjectSchema = z
  .object({
    name: z.string().min(1),
    description: z.string().nullable(),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    priority: z.nativeEnum(PriorityType),
    status: z.nativeEnum(StatusType),
    budget: z.number(),
    tags: z.string().array(),
    newTags: z.array(NewTagSchema),
    members: z.array(ProjectMemberLinkSchema),
    milestones: z.array(MilestoneSchema),
  })
  .refine((data) => data.startDate <= data.endDate, {
    message: 'Start Date must be before or equal to End Date',
    path: ['startDate'],
  })

export type UpdateProjectRequest = z.infer<typeof UpdateProjectSchema>
