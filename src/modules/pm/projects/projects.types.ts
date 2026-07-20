// src/modules/pm/projects/projects.types.ts
import { z } from 'zod'
import {
  CreateProjectMemberInputSchema,
  ProjectMemberResponseSchema,
} from './members/members.types'
import {
  CreateProjectMilestoneInputSchema,
  ProjectMilestoneResponseSchema,
} from './milestones/milestones.types'

export const ProjectResponseSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  slug: z.string(),
  description: z.string().nullable().optional(),
  startDate: z.string(),
  endDate: z.string().nullable().optional(),
  statusId: z.uuid(),
  priorityId: z.uuid(),
  budget: z.number().int(),
  isArchived: z.boolean(),
  dateCreated: z.string(),
  tagIds: z.array(z.uuid()),
  teamIds: z.array(z.uuid()),
  members: z.array(ProjectMemberResponseSchema),
  milestones: z.array(ProjectMilestoneResponseSchema),
})

export const CreateProjectCommandSchema = z.object({
  name: z.string().min(1),
  description: z.string().nullable().optional(),
  startDate: z.string(),
  endDate: z.string().nullable().optional(),
  statusId: z.uuid(),
  priorityId: z.uuid(),
  budget: z.number().int(),
  tagIds: z.array(z.uuid()),
  members: z.array(CreateProjectMemberInputSchema),
  teamIds: z.array(z.uuid()),
  milestones: z.array(CreateProjectMilestoneInputSchema),
})

export const UpdateProjectCommandSchema = z.object({
  name: z.string().min(1),
  description: z.string().nullable().optional(),
  startDate: z.string(),
  endDate: z.string().nullable().optional(),
  statusId: z.uuid(),
  priorityId: z.uuid(),
  budget: z.number().int(),
  tagIds: z.array(z.uuid()),
})

export type ProjectResponse = z.infer<typeof ProjectResponseSchema>
export type CreateProjectCommand = z.infer<typeof CreateProjectCommandSchema>
export type UpdateProjectCommand = z.infer<typeof UpdateProjectCommandSchema>

export type {
  AddProjectMemberCommand,
  CreateProjectMemberInput,
  ProjectMemberResponse,
  UpdateProjectMemberCommand,
} from './members/members.types'
export type {
  CreateProjectMilestoneCommand,
  CreateProjectMilestoneInput,
  ProjectMilestoneResponse,
  UpdateProjectMilestoneCommand,
} from './milestones/milestones.types'
export type { ProjectTeamResponse } from './teams/teams.types'
