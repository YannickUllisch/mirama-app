// src/modules/pm/projects/teams/teams.types.ts
import { z } from 'zod'

export const ProjectTeamResponseSchema = z.object({
  projectTeamId: z.uuid(),
  teamId: z.uuid(),
  name: z.string(),
  slug: z.string(),
  memberIds: z.array(z.uuid()),
  dateAdded: z.string(),
})

export type ProjectTeamResponse = z.infer<typeof ProjectTeamResponseSchema>
