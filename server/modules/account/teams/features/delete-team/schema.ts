// server/modules/account/teams/features/delete-team/schema.ts
import { z } from 'zod'

export const DeleteTeamParamsSchema = z.object({
  id: z.string().min(1),
})

export type DeleteTeamParams = z.infer<typeof DeleteTeamParamsSchema>
