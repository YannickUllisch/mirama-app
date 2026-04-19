// server/modules/account/teams/features/team-members/add-team-member/schema.ts
import { z } from 'zod'

export const AddTeamMemberParamsSchema = z.object({
  id: z.string().min(1),
})

export const AddTeamMemberSchema = z.object({
  memberId: z.string().min(1),
})

export type AddTeamMemberParams = z.infer<typeof AddTeamMemberParamsSchema>
export type AddTeamMemberRequest = z.infer<typeof AddTeamMemberSchema>
