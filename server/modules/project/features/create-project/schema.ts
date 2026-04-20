import { PriorityType, StatusType } from '@/prisma/generated/client'
import { z } from 'zod'

const ProjectMemberLinkSchema = z.object({
  memberId: z.string().min(1),
  roleId: z.string().optional(),
  isManager: z.boolean(),
})

const ProjectTeamLinkSchema = z.object({
  teamId: z.string().min(1),
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
    priority: z.enum(PriorityType),
    status: z.enum(StatusType),
    archived: z.boolean(),
    budget: z.number(),
    tags: z.string().array(),
    newTags: z.array(NewTagSchema),
    members: z.array(ProjectMemberLinkSchema),
    teams: z.array(ProjectTeamLinkSchema).default([]),
    newMilestones: z.array(NewMilestoneSchema),
  })
  .refine((data) => data.startDate <= data.endDate, {
    message: 'Start Date must be before or equal to End Date',
    path: ['startDate'],
  })

export type CreateProjectRequest = z.infer<typeof CreateProjectSchema>
