// server/modules/account/teams/features/create-team/schema.ts
import { z } from 'zod'

export const CreateTeamSchema = z.object({
  name: z.string().min(1).max(100),
})

export type CreateTeamRequest = z.infer<typeof CreateTeamSchema>
