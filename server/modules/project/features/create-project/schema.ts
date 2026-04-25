// server/modules/project/features/create-project/schema.ts
import { PriorityType, StatusType } from '@/prisma/generated/client'
import { z } from 'zod'
import {
  MilestoneSchema,
  NewTagSchema,
  ProjectMemberLinkSchema,
  ProjectTeamLinkSchema,
} from '../../domain/project.schema'

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
    // Milestones on create never have ids — strip with omit so the type is clear
    newMilestones: z.array(MilestoneSchema.omit({ id: true })),
  })
  .refine((data) => data.startDate <= data.endDate, {
    message: 'Start Date must be before or equal to End Date',
    path: ['startDate'],
  })

export type CreateProjectRequest = z.infer<typeof CreateProjectSchema>
