import { z } from 'zod'

export const GetProjectsParams = z.object({
  archived: z.enum(['true', 'false']).default('false'),
})

export type GetProjectsRequest = z.infer<typeof GetProjectsParams>
