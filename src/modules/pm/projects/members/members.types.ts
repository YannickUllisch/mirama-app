// src/modules/pm/projects/members/members.types.ts
import { z } from 'zod'

export const ProjectMemberResponseSchema = z.object({
  projectMemberId: z.uuid(),
  memberId: z.uuid(),
  roleId: z.uuid(),
  isInherited: z.boolean(),
})

export const CreateProjectMemberInputSchema = z.object({
  memberId: z.uuid(),
  roleId: z.uuid(),
})

export const AddProjectMemberCommandSchema = z.object({
  memberId: z.uuid(),
  roleId: z.uuid(),
})

export const UpdateProjectMemberCommandSchema = z.object({
  roleId: z.uuid(),
})

export type ProjectMemberResponse = z.infer<typeof ProjectMemberResponseSchema>
export type CreateProjectMemberInput = z.infer<
  typeof CreateProjectMemberInputSchema
>
export type AddProjectMemberCommand = z.infer<
  typeof AddProjectMemberCommandSchema
>
export type UpdateProjectMemberCommand = z.infer<
  typeof UpdateProjectMemberCommandSchema
>
