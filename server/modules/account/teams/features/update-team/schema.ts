// server/modules/account/teams/features/update-team/schema.ts
import { z } from 'zod'

export const UpdateTeamParamsSchema = z.object({
  id: z.string().min(1),
})

export const UpdateTeamSchema = z.object({
  name: z.string().min(1).max(100).optional(),
})

export type UpdateTeamParams = z.infer<typeof UpdateTeamParamsSchema>
export type UpdateTeamRequest = z.infer<typeof UpdateTeamSchema>
