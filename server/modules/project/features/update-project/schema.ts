// server/modules/project/features/update-project/schema.ts
import { PriorityType, StatusType } from '@/prisma/generated/client'
import { z } from 'zod'
import {
  MilestoneSchema,
  NewTagSchema,
  ProjectMemberLinkSchema,
  ProjectTeamLinkSchema,
} from '../../domain/project.schema'

export const UpdateProjectSchema = z
  .object({
    name: z.string().min(1, { message: 'Name cannot be empty.' }),
    description: z.string().nullable(),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    priority: z.enum(PriorityType),
    status: z.enum(StatusType),
    budget: z.number(),
    tags: z.string().array(),
    newTags: z.array(NewTagSchema),
    members: z.array(ProjectMemberLinkSchema),
    teams: z.array(ProjectTeamLinkSchema).default([]),
    // Milestones on update carry an optional id: existing ones have it, new ones don't
    milestones: z.array(MilestoneSchema),
  })
  .refine((data) => data.startDate <= data.endDate, {
    message: 'Start Date must be before or equal to End Date',
    path: ['startDate'],
  })

export type UpdateProjectRequest = z.infer<typeof UpdateProjectSchema>
