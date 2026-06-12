import { z } from 'zod'

export const TeamResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  dateCreated: z.coerce.date(),
  organizationId: z.string(),
  memberIds: z.array(z.string()),
})
export type TeamResponse = z.infer<typeof TeamResponseSchema>

export const CreateTeamSchema = z.object({
  name: z.string().min(2).max(100),
})
export type CreateTeamCommand = z.infer<typeof CreateTeamSchema>

export const UpdateTeamSchema = z.object({
  name: z.string().min(2).max(100),
})
export type UpdateTeamCommand = z.infer<typeof UpdateTeamSchema>

export const AddTeamMemberSchema = z.object({
  memberId: z.string(),
})
export type AddTeamMemberCommand = z.infer<typeof AddTeamMemberSchema>
