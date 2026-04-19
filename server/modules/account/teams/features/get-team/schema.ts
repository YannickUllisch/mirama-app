// server/modules/account/teams/features/get-team/schema.ts
import { z } from 'zod'

export const GetTeamParamsSchema = z.object({
  id: z.string().min(1),
})

export type GetTeamParams = z.infer<typeof GetTeamParamsSchema>
