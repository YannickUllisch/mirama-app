// server/modules/account/teams/features/team-members/remove-team-member/schema.ts
import { z } from 'zod'

export const RemoveTeamMemberParamsSchema = z.object({
  id: z.string().min(1),
  memberId: z.string().min(1),
})

export type RemoveTeamMemberParams = z.infer<typeof RemoveTeamMemberParamsSchema>
