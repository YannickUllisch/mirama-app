import { z } from 'zod'

export const ProjectIdParams = z.object({
  projectId: z.string().min(1),
})

export type ProjectIdRequest = z.infer<typeof ProjectIdParams>
